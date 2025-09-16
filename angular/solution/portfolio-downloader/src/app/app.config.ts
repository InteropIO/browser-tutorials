import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideIoConnect } from "@interopio/ng";
import IOBrowser from "@interopio/browser";
import "@interopio/theme";

import { IOConnectService } from './io-connect.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideIoConnect({
      browser: {
        factory: IOBrowser
      }
    }),
    IOConnectService
  ]
};
