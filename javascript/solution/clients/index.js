const setupClients = (clients) => {
    const table = document.getElementById("clientsTable").getElementsByTagName("tbody")[0];

    const addRowCell = (row, cellData, cssClass) => {
        const cell = document.createElement("td");

        cell.innerText = cellData;

        if (cssClass) {
            cell.className = cssClass;
        };

        row.appendChild(cell);
    };

    const addRow = (table, client) => {
        const row = document.createElement("tr");

        addRowCell(row, client.name || "");
        addRowCell(row, client.pId || "");
        addRowCell(row, client.gId || "");
        addRowCell(row, client.accountManager || "");

        row.onclick = () => {
            clientClickedHandler(client);
        };

        table.appendChild(row);
    };

    clients.forEach((client) => {
        addRow(table, client);
    });
};

const toggleIOAvailable = () => {
    const span = document.getElementById("ioConnectSpan");

    span.classList.remove("label-warning");
    span.classList.add("label-success");
    span.textContent = "io.Connect is available";
};

const clientClickedHandler = async (client) => {
    // const selectClientStocks = io.interop.methods().find(method => method.name === "SelectClient");

    // if (selectClientStocks) {
    //     io.interop.invoke(selectClientStocks, { client });
    // };

    // io.contexts.update("SelectedClient", client).catch(console.error);

    // const currentChannel = io.channels.my();

    // if (currentChannel) {
    //     io.channels.publish(client).catch(console.error);
    // };

    const restoreConfig = {
        context: { client }
    };

    try {
        const workspace = await io.workspaces.restoreWorkspace("Client Space", restoreConfig);

        await raiseNotificationOnWorkspaceOpen(client.name, workspace);
    } catch(error) {
        console.error(error.message);
    };
};

// let counter = 1;

// const stocksButtonHandler = () => {
//     // const instanceID = sessionStorage.getItem("counter");

//     // const name = `Stocks-${instanceID || counter}`;
//     // const URL = "http://localhost:9100/";

//     // io.windows.open(name, URL).catch(console.error)

//     // counter++;
//     // sessionStorage.setItem("counter", counter);

//     const stocksApp = io.appManager.application("Stocks")
//     const currentChannel = io.channels.my();

//     stocksApp.start({ channel: currentChannel }).catch(console.error);
// };

const raiseNotificationOnWorkspaceOpen = async (clientName, workspace) => {
    const options = {
        title: "New Workspace",
        body: `A new Workspace for ${clientName} was opened!`,
    };

    const notification = await io.notifications.raise(options);

    notification.onclick = () => {
        workspace.frame.focus().catch(console.error);
        workspace.focus().catch(console.error);
    };
};

const start = async () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js");
    };

    const clientsResponse = await fetch("http://localhost:8080/api/clients");
    const clients = await clientsResponse.json();

    setupClients(clients);

    // const stocksButton = document.getElementById("stocks-btn");

    // stocksButton.onclick = stocksButtonHandler;

    // const channels = {
    //     definitions: [
    //         {
    //             name: "Red",
    //             meta: {
    //                 color: "red"
    //             }
    //         },
    //         {
    //             name: "Green",
    //             meta: {
    //                 color: "green"
    //             }
    //         },
    //         {
    //             name: "Blue",
    //             meta: {
    //                 color: "#66ABFF"
    //             }
    //         },
    //         {
    //             name: "Pink",
    //             meta: {
    //                 color: "#F328BB"
    //             }
    //         },
    //         {
    //             name: "Yellow",
    //             meta: {
    //                 color: "#FFE733"
    //             }
    //         },
    //         {
    //             name: "Dark Yellow",
    //             meta: {
    //                 color: "#b09b00"
    //             }
    //         },
    //         {
    //             name: "Orange",
    //             meta: {
    //                 color: "#fa5a28"
    //             }
    //         },
    //         {
    //             name: "Purple",
    //             meta: {
    //                 color: "#c873ff"
    //             }
    //         },
    //         {
    //             name: "Lime",
    //             meta: {
    //                 color: "#8af59e"
    //             }
    //         },
    //         {
    //             name: "Cyan",
    //             meta: {
    //                 color: "#80f3ff"
    //             }
    //         }
    //     ]
    // };
    // const applications = {
    //     local: [
    //         {
    //             name: "Clients",
    //             type: "window",
    //             details: {
    //                 url: "http://localhost:9000/"
    //             }
    //         },
    //         {
    //             name: "Stocks",
    //             type: "window",
    //             details: {
    //                 url: "http://localhost:9100/",
    //                 left: 0,
    //                 top: 0,
    //                 width: 860,
    //                 height: 600
    //             }
    //         },
    //         {
    //             name: "Stock Details",
    //             type: "window",
    //             details: {
    //                 url: "http://localhost:9100/details",
    //                 left: 100,
    //                 top: 100,
    //                 width: 400,
    //                 height: 400
    //             }
    //         },
    //         {
    //             name: "Client Details",
    //             type: "window",
    //             details: {
    //                 url: "http://localhost:9200/"
    //             }
    //         }
    //     ]
    // };
    const plugins = {
        definitions: [
            {
                name: "Setup Applications",
                config: { url: "http://localhost:8080/api/applications"},
                start: setupApplications,
                critical: true
            },
            {
                name: "Setup Workspace Layouts",
                config: { url: "http://localhost:8080/api/layouts"},
                start: setupLayouts,
                critical: true
            }
        ]
    };
    const config = {
        // TODO: Chapter 1.2
        // Enter a valid license key for io.Connect Browser.
        licenseKey: "",
        browser: { libraries: [IOWorkspaces] },
        workspaces: { src: "http://localhost:9300/" },
        plugins
    };
    const { io } = await IOBrowserPlatform(config);
    window.io = io;

    toggleIOAvailable();

    // const NO_CHANNEL_VALUE = "No channel";
    // const channelContexts = await window.io.channels.list();
    // const channelNamesAndColors = channelContexts.map((channelContext) => {
    //     const channelInfo = {
    //         name: channelContext.name,
    //         color: channelContext.meta.color
    //     };

    //     return channelInfo;
    // });
    // const onChannelSelected = (channelName) => {
    //     if (channelName === NO_CHANNEL_VALUE) {
    //         if (io.channels.my()) {
    //             io.channels.leave().catch(console.error);
    //         };
    //     } else {
    //         io.channels.join(channelName).catch(console.error);
    //     };
    // };

    // createChannelSelectorWidget(
    //     NO_CHANNEL_VALUE,
    //     channelNamesAndColors,
    //     onChannelSelected
    // );
};

start().catch(console.error);