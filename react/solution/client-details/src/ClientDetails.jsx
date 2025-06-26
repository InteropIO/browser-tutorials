import  { useState, useContext} from "react";
import { useIOConnect, IOConnectContext } from "@interopio/react-hooks";
import { setClientFromWorkspace } from "./io";

function ClientDetails() {
    const [client, setClient] = useState({});
    const io = useContext(IOConnectContext);
    useIOConnect(setClientFromWorkspace(setClient));

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
                <div className="col-md-10">
                    <h1 className="text-center">Client Details</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <h3 id="clientStatus"></h3>
                </div>
            </div>
            <div className="row">
                <table id="clientsTable" className="table table-hover">
                    <tbody>
                        <tr>
                            <th>Full Name</th>
                            <td data-name>{client && client.clientName}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td data-address>{client && client.address}</td>
                        </tr>
                        <tr>
                            <th>Phone Number</th>
                            <td data-phone>{client && client.contactNumbers}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td data-email>{client && client.email}</td>
                        </tr>
                        <tr>
                            <th>Account Manager</th>
                            <td data-manager>{client && client.accountManager}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientDetails;