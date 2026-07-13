import { HttpInterceptorFn } from '@angular/common/http';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = 'http://localhost:3000';
  const updatedReq = req.clone({
    url: `${baseUrl}${req.url}`,
  });
  return next(updatedReq);
};
