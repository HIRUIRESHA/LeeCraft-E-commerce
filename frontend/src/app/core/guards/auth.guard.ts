import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);
  const router = inject(Router);
  const notify = inject(NotificationService);

  if (auth.isAuthenticated()) {
    return true;
  }

  notify.info('Please log in to continue.');

  return router.createUrlTree(
    ['/account/login'],
    {
      queryParams: {
        returnUrl: state.url
      }
    }
  );
};