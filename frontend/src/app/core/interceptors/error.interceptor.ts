import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

/** Turns every failed API call into one user-facing toast, in one place. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const message = err.error?.message ?? defaultMessageFor(err.status);
      notifications.error(message);
      return throwError(() => err);
    }),
  );
};

function defaultMessageFor(status: number): string {
  switch (status) {
    case 0:
      return 'Cannot reach the server. Check your connection and try again.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return 'The requested resource was not found.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
