import { SET_CLIENT_METHOD, SHARED_CONTEXT_NAME, NO_CHANNEL_VALUE } from "./constants";

let windowID = 0;

export const openStocks = (io) => () => {
    // The `name` and `url` parameters are required. The window name must be unique.
    const name = `Stocks-${++windowID}`;
    const URL = "http://localhost:3001/";

    io.windows.open(name, URL).catch(console.error);
};

export const setClientPortfolioInterop =
    (io) =>
    ({ clientId, clientName }) => {
        // Check whether the method exists.
        const isMethodRegistered = io.interop
            .methods()
            .some(({ name }) => name === SET_CLIENT_METHOD.name);
        if (isMethodRegistered) {
            // Invoke an Interop method by name and provide arguments for the invocation.
            io.interop.invoke(SET_CLIENT_METHOD.name, { clientId, clientName });
        }
    };

export const setClientPortfolioSharedContext =
    (io) =>
    ({ clientId = "", clientName = "", portfolio = "" }) => {
        io.contexts.update(SHARED_CONTEXT_NAME, {
            clientId,
            clientName,
            portfolio
        });
    };

// Returns all names and color codes of the avaialbale Channels.
export const getChannelNamesAndColors = async (io) => {
    // Getting a list of all Channel contexts.
    const channelContexts = await io.channels.list();

    // Extracting only the names and colors of the Channels.
    const channelNamesAndColors = channelContexts.map((channelContext) => {
        const channelInfo = {
            name: channelContext.name,
            color: channelContext.meta.color
        };

        return channelInfo;
    });

    return channelNamesAndColors;
};

// This function will join a given Channel.
export const joinChannel =
    (io) =>
    ({ value: channelName }) => {
        if (channelName === NO_CHANNEL_VALUE) {
            // Checking for the current Channel.
            if (io.channels.my()) {
                // Leaving a Channel.
                io.channels.leave();
            }
        } else {
            // Joining a Channel.
            io.channels.join(channelName);
        }
    };

export const setClientPortfolioChannels =
    (io) =>
    ({ clientId = "", clientName = "" }) => {
        // Checking for the current Channel.
        if (io.channels.my()) {
            // Publishing data to the Channel.
            io.channels.publish({ clientId, clientName });
        }
    };

export const startApp = (io) => async () => {
    const channels = await io.channels.list();
    let channel = {};
    if (io.channels.my()) {
        const channelDefinition = channels.find((channel) => channel.name === io.channels.my());
        channel = {
            name: channelDefinition.name,
            label: channelDefinition.name,
            color: channelDefinition.meta.color
        };
    } else {
        channel = {
            name: NO_CHANNEL_VALUE,
            label: NO_CHANNEL_VALUE
        };
    }
    io.appManager.application("Stocks").start({ channel });
};

export const startAppWithWorkspace = (io) => async (client) => {
    try {
        const workspace = await io.workspaces.restoreWorkspace("Client Space", { context: client });

        await raiseNotificationOnWorkspaceOpen(io.notifications, client.clientName, workspace);
    } catch (error) {
        console.error(error.message);
    }
};

const raiseNotificationOnWorkspaceOpen = async (notifications, clientName, workspace) => {
    const options = {
        title: "New Workspace",
        body: `A new Workspace for ${clientName} was opened!`
    };

    const notification = await notifications.raise(options);

    notification.onclick = () => {
        workspace.frame.focus().catch(console.error);
        workspace.focus().catch(console.error);
    };
};
