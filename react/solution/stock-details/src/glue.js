import {
    SET_PRICES_STREAM,
    SHARED_CONTEXT_NAME
} from "./constants";

export const getMyWindowContext = (setWindowContext) => async (glue) => {
    const myWindow = glue.windows.my();
    const context = await myWindow.getContext();

    setWindowContext({ stock: context.stock });

    myWindow.onContextUpdated((context) => {
        if (context) {
            setWindowContext({ stock: context.stock });
        };
    });
};

export const subscribeForInstrumentStream = (handler) => async (glue, stock) => {
    if (stock) {
        // Create a stream subscription.
        const subscription = await glue.interop.subscribe(SET_PRICES_STREAM);
        const handleUpdates = ({ data: stocks }) => {
            if (stocks[stock]) {
                handler(stocks[stock]);
            } else if (Array.isArray(stock)) {
                handler(stocks);
            };
        };
        // Specify a handler for new data.
        subscription.onData(handleUpdates);
        // Specify a handler if the subscription fails.
        subscription.onFailed(console.log);

        return subscription;
    };
};

export const subscribeForSharedContext = (handler) => (glue) => {
    // Subscribing for the shared context by
    // providing a context name and a handler for context updates.
    glue.contexts.subscribe(SHARED_CONTEXT_NAME, handler);
};