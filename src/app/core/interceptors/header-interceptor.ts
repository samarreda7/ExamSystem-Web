import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
    if (localStorage.getItem('examToken')) {
    req = req.clone({
      setHeaders: {
        AUTHORIZATION: `Bearer ${localStorage.getItem('examToken')}`,
      },
    });
  }
  return next(req);
};
