import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";
import "./App.css";
import Clients from "./Clients";

const config = {
    licenseKey: import.meta.env.VITE_LICENSE_KEY
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<Clients />);
