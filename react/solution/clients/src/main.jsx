import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Clients from "./Clients";
import { setupApplications } from "./plugins/applicationsPlugin";
import { setupLayouts } from "./plugins/layoutsPlugin";
import { IOConnectProvider } from "@interopio/react-hooks";
import IOBrowserPlatform from "@interopio/browser-platform";
import IOWorkspaces from '@interopio/workspaces-api';

const plugins = {
    definitions: [
        {
            name: "Setup Applications",
            config: { url: "http://localhost:8080/api/applicationsReact" },
            start: setupApplications,
            critical: true
        },
        {
            name: "Setup Workspace Layouts",
            config: { url: "http://localhost:8080/api/layouts" },
            start: setupLayouts,
            critical: true
        }
    ]

}

const config = {
    // Pass the `IOWorkspaces` factory function.
    browser: {
        libraries: [IOWorkspaces],
    },
    licenseKey: import.meta.env.VITE_LICENSE_KEY,
    // Specify the location of the Workspaces App.
    workspaces: { src: "http://localhost:9300/" },
    plugins
};

const settings = {
    browserPlatform: {
        factory: IOBrowserPlatform,
        config,
    },
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <IOConnectProvider settings={settings}>
        <Clients />
    </IOConnectProvider>
);

