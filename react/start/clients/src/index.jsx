import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import "./App.css";
import Clients from "./Clients";
import { setupApplications } from "./plugins/applicationsPlugin";
import { setupLayouts } from "./plugins/layoutsPlugin";
import * as serviceWorker from "./serviceWorker";
import { IOConnectProvider } from "@interopio/react-hooks";
import IOBrowserPlatform from "@interopio/browser-platform";
import IOWorkspaces from '@interopio/workspaces-api';

const plugins = {
    definitions: [
        {
            name: "Setup Applications",
            config: { url: "http://localhost:8080/api/applicationsReact"},
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

}

const config = {
    browser: {
        libraries: [IOWorkspaces],
    },
    licenseKey: import.meta.env.VITE_LICENSE_KEY,
    workspaces: { src: "http://localhost:9300/" },
    plugins
};

const settings  = {
    browserPlatform: {
        factory: IOBrowserPlatform,
        config,
    },
};

ReactDOM.render(
    <IOConnectProvider settings={settings}>
        <Clients />
    </IOConnectProvider>,
    document.getElementById("root")
);

serviceWorker.register();