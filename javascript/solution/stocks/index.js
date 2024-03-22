let clientPortfolioStocks;
let clientName;

const generateStockPrices = (handleNewPrices) => {
    setInterval(() => {
        const priceUpdate = {
            stocks: [
                {
                    RIC: "VOD.L",
                    Bid: Number(70 - Math.random() * 10).toFixed(2),
                    Ask: Number(70 + Math.random() * 10).toFixed(2)
                },
                {
                    RIC: "TSCO.L",
                    Bid: Number(90 - Math.random() * 10).toFixed(2),
                    Ask: Number(90 + Math.random() * 10).toFixed(2)
                },
                {
                    RIC: "BARC.L",
                    Bid: Number(105 - Math.random() * 10).toFixed(2),
                    Ask: Number(105 + Math.random() * 10).toFixed(2)
                },
                {
                    RIC: "BMWG.DE",
                    Bid: Number(29 - Math.random() * 10).toFixed(2),
                    Ask: Number(29 + Math.random() * 10).toFixed(2)
                },
                {
                    RIC: "AAL.L",
                    Bid: Number(46 - Math.random() * 10).toFixed(2),
                    Ask: Number(46 + Math.random() * 10).toFixed(2)
                },
                {
                    RIC: "IBM.N",
                    Bid: Number(70 - Math.random() * 10).toFixed(2),
                    Ask: Number(70 + Math.random() * 10).toFixed(2)
                },
                {
                    RIC: "AAPL.OQ",
                    Bid: Number(90 - Math.random() * 10).toFixed(2),
                    Ask: Number(90 + Math.random() * 10).toFixed(2)
                },
                {
                    RIC: "BA.N",
                    Bid: Number(105 - Math.random() * 10).toFixed(2),
                    Ask: Number(105 + Math.random() * 10).toFixed(2)
                },
                {
                    RIC: "TSLA:OQ",
                    Bid: Number(29 - Math.random() * 10).toFixed(2),
                    Ask: Number(29 + Math.random() * 10).toFixed(2)
                },
                {
                    RIC: "ENBD.DU",
                    Bid: Number(46 - Math.random() * 10).toFixed(2),
                    Ask: Number(46 + Math.random() * 10).toFixed(2)
                },
                {
                    RIC: "AMZN.OQ",
                    Bid: Number(29 - Math.random() * 10).toFixed(2),
                    Ask: Number(29 + Math.random() * 10).toFixed(2)
                },
                {
                    RIC: "MSFT:OQ",
                    Bid: Number(46 - Math.random() * 10).toFixed(2),
                    Ask: Number(46 + Math.random() * 10).toFixed(2)
                }
            ]
        };

        handleNewPrices(priceUpdate);
    }, 1500);
};

const setupStocks = (stocks) => {
    const table = document.getElementById("stocksTable").getElementsByTagName("tbody")[0];

    table.innerHTML = "";

    const addRowCell = (row, cellData, cssClass) => {
        const cell = document.createElement("td");

        cell.innerText = cellData;

        if (cssClass) {
            cell.className = cssClass;
        };

        row.appendChild(cell);
    };

    const addRow = (table, stock) => {
        const row = document.createElement("tr");

        addRowCell(row, stock.RIC || "");
        addRowCell(row, stock.Description || "");
        addRowCell(row, stock.Bid || "");
        addRowCell(row, stock.Ask || "");

        row.setAttribute("data-ric", stock.RIC);

        row.onclick = () => {
            stockClickedHandler(stock);
        };

        table.appendChild(row);
    };

    stocks.forEach((stock) => {
        addRow(table, stock);
    });
};

const toggleIOAvailable = () => {
    const span = document.getElementById("ioConnectSpan");

    span.classList.remove("label-warning");
    span.classList.add("label-success");
    span.textContent = "io.Connect is available";
};

const newPricesHandler = (priceUpdate) => {
    priceUpdate.stocks.forEach((stock) => {
        const row = document.querySelectorAll(`[data-ric="${stock.RIC}"]`)[0];

        if (!row) {
            return;
        };

        const bidElement = row.children[2];
        bidElement.innerText = stock.Bid;

        const askElement = row.children[3];
        askElement.innerText = stock.Ask;
    });

    if (priceStream) {
        priceStream.push(priceUpdate);
    };
};

const stockClickedHandler = async (stock) => {
    // const name = `${stock.BPOD} Details`;
    // const URL = "http://localhost:9100/details/";
    // const config = {
    //     left: 100,
    //     top: 100,
    //     width: 550,
    //     height: 550,
    //     context: stock
    // };

    // const stockWindowExists = io.windows.list().find(w => w.name === name);

    // if (!stockWindowExists) {
    //     io.windows.open(name, URL, config).catch(console.error);
    // };

    // const detailsApplication = io.appManager.application("Stock Details");
    // const contexts = await Promise.all(
    //     detailsApplication.instances.map(instance => instance.getContext())
    // );
    // const isRunning = contexts.find(context => context.RIC === stock.RIC);

    // if (!isRunning) {
    //     detailsApplication.start(stock).catch(console.error);
    // };

    let detailsIOConnectWindow;

    const myWorkspace = await io.workspaces.getMyWorkspace();
    let detailsWorkspaceWindow = myWorkspace.getWindow(window => window.appName === "Stock Details");

    if (detailsWorkspaceWindow) {
        detailsIOConnectWindow = detailsWorkspaceWindow.getGdWindow();
    } else {
        const myId = io.windows.my().id;
        const myImmediateParent = myWorkspace.getWindow(window => window.id === myId).parent;
        const group = await myImmediateParent.parent.addGroup();

        detailsWorkspaceWindow = await group.addWindow({ appName: "Stock Details" });

        await detailsWorkspaceWindow.forceLoad();

        detailsIOConnectWindow = detailsWorkspaceWindow.getGdWindow();
    };

    detailsIOConnectWindow.updateContext({ stock });
};

const exportPortfolioButtonHandler = async (portfolio) => {
    try {
        const intents = await io.intents.find("ExportPortfolio");

        if (!intents) {
            return;
        };

        const intentRequest = {
            intent: "ExportPortfolio",
            context: {
                type: "ClientPortfolio",
                data: { portfolio, clientName }
            }
        };

        await io.intents.raise(intentRequest);
    } catch (error) {
        console.error(error.message);
    }
};


const start = async () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js");
    };

    const stocksResponse = await fetch("http://localhost:8080/api/portfolio");
    const stocks = await stocksResponse.json();

    setupStocks(stocks);
    generateStockPrices(newPricesHandler);

    const config = {
        libraries: [IOWorkspaces]
    };
    const io = await IOBrowser(config);
    window.io = io;

    toggleIOAvailable();

    // const methodName = "SelectClient";
    // const methodHandler = (args) => {
    //     const clientPortfolio = args.client.portfolio;
    //     const stockToShow = stocks.filter(stock => clientPortfolio.includes(stock.RIC));

    //     setupStocks(stockToShow);
    // };

    // io.interop.register(methodName, methodHandler);

    window.priceStream = await io.interop.createStream("LivePrices");

    // io.contexts.subscribe("SelectedClient", updateHandler);

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

    // const updateChannelSelectorWidget = createChannelSelectorWidget(
    //     NO_CHANNEL_VALUE,
    //     channelNamesAndColors,
    //     onChannelSelected
    // );

    // const updateHandler = (client) => {
    //     if (client.portfolio) {
    //         const clientPortfolio = client.portfolio;
    //         const stockToShow = stocks.filter(stock => clientPortfolio.includes(stock.RIC));

    //         setupStocks(stockToShow);
    //     };
    // };

    // io.channels.subscribe(updateHandler);

    // const handleChannelChanges = (channelName) => {
    //     updateChannelSelectorWidget(channelName || NO_CHANNEL_VALUE);
    //     console.log(`channel changed ${channelName}`)
    // };

    // io.channels.onChanged(handleChannelChanges);

    // const appContext = await io.appManager.myInstance.getContext();
    // const channelToJoin = appContext.channel;

    // if (channelToJoin) {
    //     await io.channels.join(channelToJoin);
    // };

    const myWorkspace = await io.workspaces.getMyWorkspace();

    if (myWorkspace) {
        myWorkspace.onContextUpdated((context) => {
            if (context.client) {
                const clientPortfolio = context.client.portfolio;
                clientPortfolioStocks = stocks.filter((stock) => clientPortfolio.includes(stock.RIC));
                clientName = context.client.name;

                setupStocks(clientPortfolioStocks);
            };
        });
    };

    const exportPortfolioButton = document.getElementById("exportPortfolio");

    exportPortfolioButton.onclick = () => {
        if (!clientPortfolioStocks) {
            return;
        };

        exportPortfolioButtonHandler(clientPortfolioStocks);
    };
};

start().catch(console.error);