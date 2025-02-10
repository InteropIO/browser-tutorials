import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import "./App.css";
import StockDetails from "./StockDetails";
import * as serviceWorker from "./serviceWorker";
import IOBrowser from "@interopio/browser";
import {IOConnectProvider} from "@interopio/react-hooks";

const settings = {
    browser:{
        factory: IOBrowser
    }
}

ReactDOM.render(
    <IOConnectProvider settings={settings}>
        <StockDetails/>
    </IOConnectProvider>,
    document.getElementById("root")
)

serviceWorker.register();