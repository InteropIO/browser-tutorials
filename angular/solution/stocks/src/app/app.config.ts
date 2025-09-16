import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import "@interopio/theme";
import { provideIoConnect } from "@interopio/ng";
import IOBrowser, { IOConnectBrowser } from "@interopio/browser";
import IOWorkspaces from "@interopio/workspaces-api"

import { routes } from './app.routes';
import { DataService } from './data.service';
import { IOConnectService } from './io-connect.service';

const config: IOConnectBrowser.Config = {
  // widget: {
  //     enable: true
  // }
  libraries: [IOWorkspaces]
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideIoConnect({
      browser: {
        factory: IOBrowser,
        config
      }
    }),
    DataService,
    IOConnectService
  ]
};
