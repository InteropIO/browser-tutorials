import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import StockDetails from "./StockDetails";
import IOBrowser from "@interopio/browser";
import { IOConnectProvider } from "@interopio/react-hooks";

const settings = {
    browser: {
        factory: IOBrowser
    }
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <IOConnectProvider settings={settings}>
        <StockDetails />
    </IOConnectProvider>
);
