import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

  const token = localStorage.getItem('Examtoken');
  const role = localStorage.getItem('Examrole');

  if (token) {
    if (role === 'Student') {
      return router.parseUrl('/student/dashboard');
    } else if (role === 'Teacher') {
      return router.parseUrl('/teacher/dashboard');
    }

    
    return router.parseUrl('/student/dashboard');
  }

  return true; 
};
