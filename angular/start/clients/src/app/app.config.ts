import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection
} from "@angular/core";
import { provideHttpClient } from "@angular/common/http";

import { DataService } from "./data.service";
import { IOConnectService } from "./io-connect.service";

import "@interopio/theme";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideHttpClient(),
        DataService,
        IOConnectService
    ]
};
