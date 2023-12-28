import React, { useState } from "react";
import { useGlue } from "@glue42/react-hooks";
import { setupIntentListener } from "./glue";

function PortfolioDownloader() {
    const [clientName, setClientName] = useState("");

    useGlue(setupIntentListener(setClientName));

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-12">
                    <h1 className="text-center">Portfolio Downloader</h1>
                </div>
            </div>
            <div>
                <h3 className="text-center">downloading portfolio {clientName ? "of " + clientName : ""} ...</h3>
            </div>
        </div>
    );
};

export default PortfolioDownloader;