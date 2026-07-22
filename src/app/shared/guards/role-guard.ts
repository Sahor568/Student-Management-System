import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const allowedRoles: string[] = route.data['allowed'];

  if (allowedRoles.includes(authService.getCurrentUser().role)) {
    return true;
  }
  router.navigate(['/dashboard']);
  return false;
};
