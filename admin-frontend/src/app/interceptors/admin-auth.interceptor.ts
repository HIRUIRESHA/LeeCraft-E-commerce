import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AdminAuthService } from '../services/admin-auth.service';

export const adminAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const adminAuth = inject(AdminAuthService);
  const token = adminAuth.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
