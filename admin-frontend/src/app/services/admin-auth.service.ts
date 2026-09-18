import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

interface AuthResponse {
  token: string;
  id: number;
  fullName: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly TOKEN_KEY = 'leecraft_admin_token';
  private readonly USER_KEY = 'leecraft_admin_user';

  private http = inject(HttpClient);
  private router = inject(Router);

  private accessToken: string | null = null;
  private readonly currentAdmin = signal<AdminUser | null>(null);

  readonly admin = computed(() => this.currentAdmin());
  readonly isAuthenticated = computed(() => !!this.currentAdmin());

  constructor() {
    this.restoreSession();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          if (res.role !== 'ADMIN') {
            throw new Error('Access denied. Admin privileges required.');
          }
          this.setSession(res);
        })
      );
  }

  logout(): void {
    this.accessToken = null;
    this.currentAdmin.set(null);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
      }
    } catch (e) {
      console.error('Failed to clear admin session', e);
    }
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.accessToken;
  }

  private setSession(res: AuthResponse): void {
    this.accessToken = res.token;
    const admin: AdminUser = {
      id: res.id,
      fullName: res.fullName,
      email: res.email,
      role: res.role,
    };
    this.currentAdmin.set(admin);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(admin));
      }
    } catch (e) {
      console.error('Failed to persist admin session', e);
    }
  }

  private restoreSession(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const userStr = localStorage.getItem(this.USER_KEY);
        if (token && userStr) {
          const user: AdminUser = JSON.parse(userStr);
          if (user.role === 'ADMIN') {
            this.accessToken = token;
            this.currentAdmin.set(user);
          }
        }
      }
    } catch (e) {
      console.error('Failed to restore admin session', e);
    }
  }
}
