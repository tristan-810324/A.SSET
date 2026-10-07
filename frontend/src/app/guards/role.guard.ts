import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, type AuthUser } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.getUser();
  const roles = route.data['roles'] as AuthUser['role'][] | undefined;
  return user && (!roles || roles.includes(user.role))
    ? true
    : router.createUrlTree(['/login']);
};
