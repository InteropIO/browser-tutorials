import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';

import { provideIoConnect } from "@interopio/ng";
import IOBrowser, { IOConnectBrowser } from "@interopio/browser";
import IOWorkspaces from "@interopio/workspaces-api"
import "@interopio/theme";

import { IOConnectService } from './io-connect.service';

const config: IOConnectBrowser.Config = {
  libraries: [IOWorkspaces]
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideIoConnect({
      browser: {
        factory: IOBrowser,
        config
      }
    }),
    IOConnectService
  ]
};
