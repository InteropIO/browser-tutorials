import { NO_CHANNEL_VALUE, SET_CLIENT_METHOD, SET_PRICES_STREAM } from "./constants";
import { SHARED_CONTEXT_NAME } from "./constants";

export const publishInstrumentPrice = (stream) => {
    setInterval(() => {
        const stocks = {
            "VOD.L": {
                Bid: Number(70 - Math.random() * 10).toFixed(2),
                Ask: Number(70 + Math.random() * 10).toFixed(2)
            },
            "TSCO.L": {
                Bid: Number(90 - Math.random() * 10).toFixed(2),
                Ask: Number(90 + Math.random() * 10).toFixed(2)
            },
            "BARC.L": {
                Bid: Number(105 - Math.random() * 10).toFixed(2),
                Ask: Number(105 + Math.random() * 10).toFixed(2)
            },
            "BMWG.DE": {
                Bid: Number(29 - Math.random() * 10).toFixed(2),
                Ask: Number(29 + Math.random() * 10).toFixed(2)
            },
            "AAL.L": {
                Bid: Number(46 - Math.random() * 10).toFixed(2),
                Ask: Number(46 + Math.random() * 10).toFixed(2)
            },
            "IBM.N": {
                Bid: Number(70 - Math.random() * 10).toFixed(2),
                Ask: Number(70 + Math.random() * 10).toFixed(2)
            },
            "AAPL.OQ": {
                Bid: Number(90 - Math.random() * 10).toFixed(2),
                Ask: Number(90 + Math.random() * 10).toFixed(2)
            },
            "BA.N": {
                Bid: Number(105 - Math.random() * 10).toFixed(2),
                Ask: Number(105 + Math.random() * 10).toFixed(2)
            },
            "TSLA:OQ": {
                Bid: Number(29 - Math.random() * 10).toFixed(2),
                Ask: Number(29 + Math.random() * 10).toFixed(2)
            },
            "ENBD.DU": {
                Bid: Number(46 - Math.random() * 10).toFixed(2),
                Ask: Number(46 + Math.random() * 10).toFixed(2)
            },
            "AMZN.OQ": {
                Bid: Number(29 - Math.random() * 10).toFixed(2),
                Ask: Number(29 + Math.random() * 10).toFixed(2)
            },
            "MSFT:OQ": {
                Bid: Number(46 - Math.random() * 10).toFixed(2),
                Ask: Number(46 + Math.random() * 10).toFixed(2)
            }
        };
        // Push the new stock prices to the stream using the `stream.push()` method.
        stream.push(stocks);
    }, 1500);
};

export const openStockDetails = (io) => async (stock)=>{
    const detailsApplication = io.appManager.application("Stock Details");
    
    const contexts = await Promise.all(
        detailsApplication.instances.map(instance => instance.getContext())
    );
    const isRunning = contexts.find(context => context.stock.RIC === stock.RIC);

    if (!isRunning) {
        detailsApplication.start({ stock }).catch(console.error);
    };
}

export const registerSetClientMethod = (setClient) => (io) => {
    io.interop.register(SET_CLIENT_METHOD, setClient);
}

export const createInstrumentStream = async (io) => {
    const stream = await io.interop.createStream(SET_PRICES_STREAM);
    publishInstrumentPrice(stream);
};

export const subscribeForInstrumentStream = (handler) => async (io, stock) => {
    if(stock){
        const subscription = await io.interop.subscribe(SET_PRICES_STREAM);

        const handleUpdates = ({data: stocks}) =>{
            if(stocks[stock]){
                handler(stocks[stock])
            }else if(Array.isArray(stock)){
                handler(stocks);
            }
        }

        subscription.onData(handleUpdates);

        subscription.onFailed(console.log);

        return subscription;
    }
}

export const setClientPortfolioSharedContext = (io) => (
    {
        clientId = "",
        clientName = "",
        portfolio = ""
    }
) => {
    io.contexts.update(SHARED_CONTEXT_NAME, {
        clientId,
        clientName,
        portfolio
    });
};


export const subscribeForSharedContext = (handler) => (io) => {
    io.contexts.subscribe(SHARED_CONTEXT_NAME, handler);
};

export const getChannelNamesAndColors = async (io) => {
    const channelContexts = await io.channels.list();

    const channelNamesAndColors = channelContexts.map((channelContext)=>{
        const channelInfo = {
            name: channelContext.name, 
            color: channelContext.meta.color
        };

        return channelInfo;
    })

    return channelNamesAndColors;
}

export const joinChannel = (io) => ({ value: channelName }) => {
    if (channelName === NO_CHANNEL_VALUE) {
        if (io.channels.my()) {
            io.channels.leave().catch(console.error);
        };
    } else {
        io.channels.join(channelName).catch(console.error);
    };
};

export const subscribeForChannels = (handler) => (io) => {
    io.channels.subscribe(handler);
};

export const getMyWindowContext = (setWindowContext) => async (io) => {
    const myWindow = io.appManager.myInstance;
    const context = await myWindow.getContext();

    setWindowContext({ channel: context.channel });
};

export const setClientFromWorkspace = (setClient) => async (io) => {
    const myWorkspace = await io.workspaces.getMyWorkspace();
    myWorkspace.onContextUpdated((context) => {
        if (context) {
            setClient(context);
        };
    });
};

export const openStockDetailsInWorkspace = (io) => async (stock) => {
    let detailsWindow;

    const myWorkspace = await io.workspaces.getMyWorkspace();

    let detailsWorkspaceWindow = myWorkspace.getWindow(window => window.appName === "Stock Details");

    if (detailsWorkspaceWindow) {
        detailsWindow = detailsWorkspaceWindow.getGdWindow();
    } else {
        const myId = io.windows.my().id;
        const myImmediateParent = myWorkspace.getWindow(window => window.id === myId).parent;
        const group = await myImmediateParent.parent.addGroup();

        detailsWorkspaceWindow = await group.addWindow({ appName: "Stock Details" });
        await detailsWorkspaceWindow.forceLoad();
        detailsWindow = detailsWorkspaceWindow.getGdWindow();
    };

    detailsWindow.updateContext({ stock });
};

export const raiseExportPortfolioIntentRequest = (io) => async (portfolio, clientName) => {
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

    } catch(error) {
        console.error(error.message);
    }
};