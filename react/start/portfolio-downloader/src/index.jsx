import ReactDOM from "react-dom";
import { IOConnectProvider } from "@interopio/react-hooks";
import IOBrowser from "@interopio/browser";
import PortfolioDownloader from './PortfolioDownloader';
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

const settings = {
    browser: {
        factory: IOBrowser,
    }
};

ReactDOM.render(
    <IOConnectProvider settings={settings}>
        <PortfolioDownloader />
    </IOConnectProvider>,
    document.getElementById("root")
);
