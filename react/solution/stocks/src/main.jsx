import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import "./App.css";
import Stocks from "./Stocks";
import * as serviceWorker from "./serviceWorker";
import IOBrowser from "@interopio/browser";
import { IOConnectProvider } from "@interopio/react-hooks";
import IOWorkspaces from "@interopio/workspaces-api"

const config = { libraries: [IOWorkspaces] };

const settings = {
    browser: {
        factory: IOBrowser,
        config
    }
};

ReactDOM.render(
    <IOConnectProvider settings={settings}>
        <Stocks />
    </IOConnectProvider>,
    document.getElementById("root")
);

serviceWorker.register();
