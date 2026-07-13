import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { ConfirmationService, MessageService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { delayInterceptor } from './core/interceptor/delay.interceptor';
import { errorInterceptor } from './core/interceptor/error.interceptor';
import { requestInterceptor } from './core/interceptor/request.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([requestInterceptor, errorInterceptor, delayInterceptor]),
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
  ],
};
