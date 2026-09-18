import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/user.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  private readonly currentUser = signal<User | null>(null);

  readonly user = computed(() => this.currentUser());
  readonly isAuthenticated = computed(() => !!this.currentUser());

  constructor(private http: HttpClient) {}

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
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private setSession(res: AuthResponse): void {
    this.accessToken = res.token;

    this.currentUser.set({
      id: res.id,
      fullName: res.fullName,
      email: res.email
    });
  }
}
