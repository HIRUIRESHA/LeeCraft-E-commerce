import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'leecraft_token';
  private readonly USER_KEY = 'leecraft_user';

  private accessToken: string | null = null;
  private readonly currentUser = signal<User | null>(null);

  readonly user = computed(() => this.currentUser());
  readonly isAuthenticated = computed(() => !!this.currentUser());

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  private restoreSession(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const userStr = localStorage.getItem(this.USER_KEY);
        if (token && userStr) {
          this.accessToken = token;
          this.currentUser.set(JSON.parse(userStr));
        }
      }
    } catch (e) {
      console.error('Failed to restore session from localStorage', e);
    }
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}/auth/login`,
        req,
        { withCredentials: true }
      )
      .pipe(
        tap((res) => this.setSession(res))
      );
  }

  register(req: RegisterRequest): Observable<string> {
    return this.http
      .post(
        `${environment.apiUrl}/auth/register`,
        req,
        {
          withCredentials: true,
          responseType: 'text'
        }
      );
  }

  verifyEmail(email: string, code: string): Observable<string> {
    return this.http.post(
      `${environment.apiUrl}/auth/verify`,
      {
        email,
        code
      },
      {
        withCredentials: true,
        responseType: 'text'
      }
    );
  }

  resendVerificationCode(email: string): Observable<string> {
    return this.http.post(
      `${environment.apiUrl}/auth/resend-verification`,
      { email },
      {
        withCredentials: true,
        responseType: 'text'
      }
    );
  }

  forgotPassword(email: string): Observable<string> {
  return this.http.post(
    `${environment.apiUrl}/auth/forgot-password`,
    { email },
    {
      withCredentials: true,
      responseType: 'text'
    }
  );
}

resetPassword(
  email: string,
  code: string,
  newPassword: string
): Observable<string> {
  return this.http.post(
    `${environment.apiUrl}/auth/reset-password`,
    {
      email,
      code,
      newPassword
    },
    {
      withCredentials: true,
      responseType: 'text'
    }
  );
}

  

  logout(): void {
    this.accessToken = null;
    this.currentUser.set(null);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
      }
    } catch (e) {
      console.error('Failed to clear session from localStorage', e);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  updateCurrentUser(user: User): void {
    this.currentUser.set(user);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.error('Failed to update user in localStorage', e);
    }
  }

  private setSession(res: AuthResponse): void {
    this.accessToken = res.token;

    const user: User = {
      id: res.id,
      fullName: res.fullName,
      email: res.email
    };

    this.currentUser.set(user);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
    } catch (e) {
      console.error('Failed to save session to localStorage', e);
    }
  }
}
