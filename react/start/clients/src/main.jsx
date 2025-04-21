import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import "./App.css";
import Clients from "./Clients";
import * as serviceWorker from "./serviceWorker";

const config = {
    licenseKey: import.meta.env.VITE_LICENSE_KEY
}

ReactDOM.render(<Clients />, document.getElementById("root"));

serviceWorker.register();