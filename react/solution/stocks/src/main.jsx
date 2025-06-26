import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Stocks from "./Stocks";
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

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <IOConnectProvider settings={settings}>
        <Stocks />
    </IOConnectProvider>,
);
