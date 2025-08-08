import React, { useEffect, useState, useContext } from "react";
import { REQUEST_OPTIONS } from "./constants";
import { useIOConnect, IOConnectContext } from "@interopio/react-hooks";
import {
    createInstrumentStream,
    subscribeForInstrumentStream,
    setClientFromWorkspace,
    openStockDetailsInWorkspace,
    raiseExportPortfolioIntentRequest
} from "./io";

function Stocks() {
    const [portfolio, setPortfolio] = useState([]);
    const [{ clientId, clientName }, setClient] = useState({});
    const [prices, setPrices] = useState({});
    const subscription = useIOConnect(
        (io, portfolio) => {
            if (portfolio.length > 0) {
                return subscribeForInstrumentStream(setPrices)(io, portfolio);
            }
        },
        [portfolio]
    );
    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                // Close the existing subscription when a new client has been selected.
                subscription && typeof subscription.close === "function" && subscription.close();

                const url = `http://localhost:8080${clientId ? `/api/portfolio/${clientId}` : "/api/portfolio"}`;
                const response = await fetch(url, REQUEST_OPTIONS);
                const portfolio = await response.json();
                setPortfolio(portfolio);
            } catch (error) {
                console.error(error);
            }
        };
        fetchPortfolio();
    }, [clientId]);

    const io = useContext(IOConnectContext);
    const showStockDetails = useIOConnect(openStockDetailsInWorkspace);
    useIOConnect(createInstrumentStream);
    const setDefaultClient = () => setClient({ clientId: "", clientName: "" });
    useIOConnect(setClientFromWorkspace(setClient));
    const exportPortfolioButtonHandler = useIOConnect(raiseExportPortfolioIntentRequest);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    {!io && (
                        <span id="ioConnectSpan" className="badge badge-warning">
                            io.Connect is unavailable
                        </span>
                    )}
                    {io && (
                        <span id="ioConnectSpan" className="badge badge-success">
                            io.Connect is available
                        </span>
                    )}
                </div>
                <div className="col-md-8">
                    <h1 id="title" className="text-center">
                        Stocks
                    </h1>
                </div>
                <div className="col-md-2 py-2">
                    <button
                        type="button"
                        className="mb-3 btn btn-primary"
                        onClick={() => setDefaultClient()}
                    >
                        Show All
                    </button>
                </div>
                <div className="col-md-10 py-10">
                    <button
                        type="button"
                        className="mb-3 btn btn-primary"
                        onClick={() => exportPortfolioButtonHandler(portfolio, clientName)}
                    >
                        Export Portfolio
                    </button>
                </div>
            </div>
            {clientId && (
                <h2 className="p-3">
                    Client {clientName} - {clientId}
                </h2>
            )}
            <div className="row">
                <div className="col">
                    <table id="portfolioTable" className="table table-hover">
                        <thead>
                            <tr>
                                <th>Symbol</th>
                                <th>Description</th>
                                <th className="text-right">Bid</th>
                                <th className="text-right">Ask</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolio.map(({ RIC, Description, Bid, Ask, ...rest }) => (
                                <tr
                                    key={RIC}
                                    onClick={() =>
                                        showStockDetails({ RIC, Description, Bid, Ask, ...rest })
                                    }
                                >
                                    <td>{RIC}</td>
                                    <td>{Description}</td>
                                    <td className="text-right">
                                        {prices[RIC] ? prices[RIC].Bid : Bid}
                                    </td>
                                    <td className="text-right">
                                        {prices[RIC] ? prices[RIC].Ask : Ask}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Stocks;
