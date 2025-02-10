import {
    SET_CLIENT_METHOD,
    SHARED_CONTEXT_NAME,
    NO_CHANNEL_VALUE
} from "./constants";

let windowID = 0;

export const openStocks = (io) => () => {
    const name = `Stocks-${++windowID}`;
    const URL = "http://localhost:3001/";

    io.windows.open(name, URL).catch(console.error);
};

export const setClientPortfolioInterop = (io) => ({ clientId, clientName }) => {
    const isMethodRegistered = io.interop
        .methods()
        .some(({ name }) => name === SET_CLIENT_METHOD.name);
    if (isMethodRegistered) {
        io.interop.invoke(SET_CLIENT_METHOD.name, { clientId, clientName });
    };
};

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

export const getChannelNamesAndColors = async (io) => {
    const channelContexts = await io.channels.list();

    const channelNamesAndColors = channelContexts.map((channelContext) => {
        const channelInfo = {
            name: channelContext.name,
            color: channelContext.meta.color
        };

        return channelInfo;
    });

    return channelNamesAndColors;
};

export const joinChannel = (io) => ({ value: channelName }) => {
    if (channelName === NO_CHANNEL_VALUE) {
        if (io.channels.my()) {
            io.channels.leave();
        }
    } else {
        io.channels.join(channelName);
    };
};

export const setClientPortfolioChannels = (io) => (
    {
        clientId = "",
        clientName = ""
    }
) => {
    if (io.channels.my()) {
       
        io.channels.publish({ clientId, clientName });
    };
};

// export const startApp = io => async () => {
//     const channels = await io.channels.list();
//     let channel = {};
//     if (io.channels.my()) {
//         const channelDefinition = channels.find(channel => channel.name === io.channels.my());
//         channel = {
//             name: channelDefinition.name,
//             label: channelDefinition.name,
//             color: channelDefinition.meta.color
//         };
//     } else {
//         channel = {
//             name: NO_CHANNEL_VALUE,
//             label: NO_CHANNEL_VALUE
//         }
//     };
//     io.appManager.application("Stocks").start({ channel });
// };

export const startAppWithWorkspace = (io) => async (client) => {
    try {
        const workspace = await io.workspaces.restoreWorkspace("Client Space", { context: client });
        
        await raiseNotificationOnWorkspaceOpen(io.notifications, client.clientName, workspace)
    } catch (error) {
        console.error(error.message);
    }
};

const raiseNotificationOnWorkspaceOpen = async (notifications, clientName, workspace) => {
    const options = {
        title: "New Workspace",
        body: `A new Workspace for ${clientName} was opened!`,
    };

    const notification = await notifications.raise(options);

    notification.onclick = () => {
        workspace.frame.focus().catch(console.error);
        workspace.focus().catch(console.error);
    };
};