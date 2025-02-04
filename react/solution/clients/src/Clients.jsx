import React, { useEffect, useState, useContext } from "react";
import { REQUEST_OPTIONS } from "./constants";
import { IOConnectContext, useIOConnect } from "@interopio/react-hooks";
import { startAppWithWorkspace } from "./io";

function Clients() {
    const [clients, setClients] = useState([]);
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/clients", REQUEST_OPTIONS);
                const clients = await response.json();
                setClients(clients);
            } catch (e) {
                console.log(e);
            }
        };
        fetchClients();
    }, []);
    const io = useContext(IOConnectContext);
    window.io = io;
    const openWorkspace = useIOConnect(startAppWithWorkspace);

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
                    <h1 className="text-center">Clients</h1>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <table id="clientsTable" className="table table-hover">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>PID</th>
                                <th>GID</th>
                                <th>Account Manager</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(({ name, pId, gId, accountManager, portfolio, ...rest }) => (
                                <tr
                                    key={pId}
                                    onClick={() => {
                                        openWorkspace({ clientId: gId, clientName: name, accountManager, portfolio, ...rest });
                                    }}
                                >
                                    <td>{name}</td>
                                    <td>{pId}</td>
                                    <td>{gId}</td>
                                    <td>{accountManager}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Clients;
