import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticatedSync()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticatedSync()) {
    router.navigate(['/dashboard']);
    return false;
  } else {
    return true;
  }
};
