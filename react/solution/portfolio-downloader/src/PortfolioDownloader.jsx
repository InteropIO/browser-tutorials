import React, { useState, useContext } from "react";
import {useIOConnect, IOConnectContext} from "@interopio/react-hooks";
import { setupIntentListener } from "./io";

function PortfolioDownloader() {
  const [clientName, setClientName] = useState("");

  window.io = useContext(IOConnectContext);

  useIOConnect(setupIntentListener(setClientName));

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
)}

export default PortfolioDownloader;
