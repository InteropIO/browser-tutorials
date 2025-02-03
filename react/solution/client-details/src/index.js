import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import IOBrowser from "@interopio/browser"
import { IOConnectProvider } from "@interopio/react-hooks";
import "bootstrap/dist/css/bootstrap.css";
import ClientDetails from "./ClientDetails";
import IOWorkspaces from "@interopio/workspaces-api";

const config = { libraries: [IOWorkspaces] };

const settings  = {
    browser: {
        factory: IOBrowser,
        config
    }
};

ReactDOM.render(
    <IOConnectProvider settings={settings}>
        <ClientDetails />
    </IOConnectProvider>,
    document.getElementById("root")
);
