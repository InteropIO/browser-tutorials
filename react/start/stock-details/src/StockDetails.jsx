import React from "react";
import { IOConnectContext, useIOConnect } from "@interopio/react-hooks"
import { useContext } from "react";
import { useState } from "react";
import { getMyWindowContext, subscribeForInstrumentStream, subscribeForSharedContext } from "./io";

function StockDetails() {
    const io = useContext(IOConnectContext);

    const [windowContext, setWindowContext] = useState({});
    const [{ clientId, clientName, portfolio }, setClient] = useState({});


    useIOConnect(getMyWindowContext(setWindowContext));
    useIOConnect(subscribeForSharedContext(setClient));

    const {
        stock: { RIC, BPOD, Bloomberg, Description, Exchange, Venues } = {}
    } = windowContext || {};

    const [{ Bid, Ask }, setPrices] = useState({ Bid: windowContext.Bid, Ask: windowContext.Ask});

    useIOConnect(subscribeForInstrumentStream(setPrices), [RIC]);

    console.log(windowContext);
    return (
        <div className="container-fluid">
            <div className="row">
                {clientId && (
                    <>
                        <h2 className="p-3">
                            Client {clientName} - {clientId}
                        </h2>
                        {RIC && portfolio.length && !portfolio.includes(RIC) && (
                            <h4 className="p-3">
                                The client doesn't have this stock in their portfolio.
                            </h4>
                        )}
                    </>
                )}
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
                    <h1 className="text-center">Stock Details {RIC}</h1>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <table id="clientsTable" className="table table-hover">
                        <tbody>
                            <tr>
                                <th>RIC</th>
                                <td>{RIC}</td>
                            </tr>
                            <tr>
                                <th>BPOD</th>
                                <td>{BPOD}</td>
                            </tr>
                            <tr>
                                <th>Bloomberg</th>
                                <td>{Bloomberg}</td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td>{Description}</td>
                            </tr>
                            <tr>
                                <th>Exchange</th>
                                <td>{Exchange}</td>
                            </tr>
                            <tr>
                                <th>Venues</th>
                                <td>{Venues}</td>
                            </tr>
                            <tr>
                                <th>Bid</th>
                                <td>{Bid}</td>
                            </tr>
                            <tr>
                                <th>Ask</th>
                                <td>{Ask}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StockDetails;