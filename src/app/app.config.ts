import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { ConfirmationService, MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  DelayInterceptor,
  RequestHeaderInterceptor,
  ResponseErrorInterceptor,
} from './core/interceptor/http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([RequestHeaderInterceptor, ResponseErrorInterceptor, DelayInterceptor]),
    ),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
    MessageService,
    DialogService,
    DynamicDialogConfig,
    ConfirmationService,
    provideHttpClient(), //recent method to http client in angular more than 17+ angular
  ],
};
