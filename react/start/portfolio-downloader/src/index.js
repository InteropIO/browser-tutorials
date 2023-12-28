import ReactDOM from "react-dom";
import { GlueProvider } from "@glue42/react-hooks";
import GlueWeb from "@glue42/web";
import PortfolioDownloader from './PortfolioDownloader';
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

const settings = {
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
