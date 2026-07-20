import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const allowedRoles: string[] = route.data['allowed'];

  return allowedRoles.includes(authService.getCurrentUser().role);
};
