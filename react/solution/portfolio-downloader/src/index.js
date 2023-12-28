import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import { GlueProvider } from "@glue42/react-hooks";
import './index.css';
import GlueWeb from "@glue42/web";
import PortfolioDownloader from './PortfolioDownloader';

const settings  = {
  web: {
      factory: GlueWeb,
  }
};

ReactDOM.render(
  <GlueProvider settings={settings}>
      <PortfolioDownloader />
  </GlueProvider>,
  document.getElementById("root")
);
