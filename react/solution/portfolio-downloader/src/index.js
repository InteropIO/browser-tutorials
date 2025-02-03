import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import { IOConnectProvider } from "@interopio/react-hooks";
import './index.css';
import IOBrowser from "@interopio/browser";
import PortfolioDownloader from './PortfolioDownloader';

const settings  = {
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
