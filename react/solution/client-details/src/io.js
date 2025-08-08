export const setClientFromWorkspace = (setClient) => async (io) => {
    const myWorkspace = await io.workspaces.getMyWorkspace();
    myWorkspace.onContextUpdated((context) => {
        if (context) {
            setClient(context);
            myWorkspace.setTitle(context.clientName);
        }
    });
};
