import ReactDOM from "react-dom/client";
import { IOConnectProvider } from "@interopio/react-hooks";
import './index.css';
import "bootstrap/dist/css/bootstrap.css";
import IOBrowser from "@interopio/browser";
import PortfolioDownloader from './PortfolioDownloader';

const settings = {
  browser: {
    factory: IOBrowser,
  }
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <IOConnectProvider settings={settings}>
    <PortfolioDownloader />
  </IOConnectProvider>,
);
