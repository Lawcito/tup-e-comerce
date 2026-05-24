import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isAuth = await authService.isAuthenticated();

  if (isAuth) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};