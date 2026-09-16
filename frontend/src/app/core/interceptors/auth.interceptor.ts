import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Attaches the in-memory access token to every API request, and on a 401
 * makes one attempt to refresh it (via the httpOnly refresh cookie) before
 * retrying the original request. A second 401 is passed through as a real
 * auth failure instead of looping.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getAccessToken();
  const authedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authedReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401 || req.url.includes('/auth/')) {
        return throwError(() => err);
      }
      return auth.refresh().pipe(
        switchMap(() => {
          const retried = req.clone({
            setHeaders: { Authorization: `Bearer ${auth.getAccessToken()}` },
          });
          return next(retried);
        }),
        catchError((refreshErr) => throwError(() => refreshErr)),
      );
    }),
  );
};
