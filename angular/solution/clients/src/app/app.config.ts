import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideIoConnect } from '@interopio/ng';
import IOBrowserPlatform, { IOConnectBrowserPlatform } from '@interopio/browser-platform';
import { IOConnectBrowser } from "@interopio/browser";
import IOWorkspaces from '@interopio/workspaces-api';
import '@interopio/theme';

import { DataService } from './data.service';
import { IOConnectService } from './io-connect.service';
import { setupApplications } from '../plugins/applicationsPlugin';
import { setupLayouts } from "../plugins/layoutsPlugin";

const channels: IOConnectBrowserPlatform.Channels.Config = {
  definitions: [
    {
        name: "Red",
        meta: {
            color: "red"
        }
    },
    {
        name: "Green",
        meta: {
            color: "green"
        }
    },
    {
        name: "Blue",
        meta: {
            color: "#66ABFF"
        }
    },
    {
        name: "Pink",
        meta: {
            color: "#F328BB"
        }
    },
    {
        name: "Yellow",
        meta: {
            color: "#FFE733"
        }
    },
    {
        name: "Dark Yellow",
        meta: {
            color: "#b09b00"
        }
    },
    {
        name: "Orange",
        meta: {
            color: "#fa5a28"
        }
    },
    {
        name: "Purple",
        meta: {
            color: "#c873ff"
        }
    },
    {
        name: "Lime",
        meta: {
            color: "#8af59e"
        }
    },
    {
        name: "Cyan",
        meta: {
            color: "#80f3ff"
        }
    }
  ]
};

const widget: IOConnectBrowserPlatform.Widget.Config = {
  // It's required to specify the locations of the bundle, styles and fonts for the widget.
  sources: {
      bundle: 'http://localhost:8080/static/widget/io-browser-widget.es.js',
      styles: ['http://localhost:8080/static/widget/styles.css'],
      fonts: ['http://localhost:8080/static/widget/fonts.css']
  }
};

const workspaces: IOConnectBrowserPlatform.Workspaces.Config = {
  src: "http://localhost:9300/"
};

const browser: IOConnectBrowser.Config = {
  // widget: {
  //     enable: true
  // },
  libraries: [IOWorkspaces]
};

const applications: IOConnectBrowserPlatform.Applications.Config = {
  local: [
    {
      name: "Stocks",
      type: "window",
      details: {
          url: "http://localhost:4100/",
          left: 0,
          top: 0,
          width: 860,
          height: 600
      }
    },
    {
      name: "Stock Details",
      type: "window",
      details: {
          url: "http://localhost:4100/details",
          left: 100,
          top: 100,
          width: 400,
          height: 400
      }
    }
  ]
};

// Define Plugins Config
const plugins: IOConnectBrowserPlatform.Plugins.Config = {
  definitions: [
    {
      name: "Setup Applications",
      config: { url: "http://localhost:8080/api/applicationsAngular"},
      start: setupApplications,
      critical: true
    },
    {
      name: "Setup Workspace Layouts",
      config: { url: "http://localhost:8080/api/layouts"},
      start: setupLayouts,
      critical: true
    }
  ]
};

const config: IOConnectBrowserPlatform.Config = {
  licenseKey: 'your-license-key',
  channels,
  // applications,
  // widget,
  workspaces,
  browser,
  plugins
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideIoConnect({
      browserPlatform: {
        factory: IOBrowserPlatform,
        config,
      },
    }),
    DataService,
    IOConnectService,
  ],
};
