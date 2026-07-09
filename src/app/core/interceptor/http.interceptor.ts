import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, delay } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ToastService } from '../../shared/services/toast.service';

export const RequestHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = 'http://localhost:3000';
  const updatedReq = req.clone({
    url: `${baseUrl}${req.url}`,
  });
  return next(updatedReq);
};

export const DelayInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(delay(3000));
};

export const ResponseErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  return next(req).pipe(
    catchError((error) => {
      toastService.showToast('error', error.statusText, error.message);
      return throwError(() => error);
    }),
  );
};
