import { SET_PRICES_STREAM, SHARED_CONTEXT_NAME } from "./constants";

export const getMyWindowContext = (setWindowContext) => async (io) => {
    const myWindow = io.windows.my();
    const context = await myWindow.getContext();

    setWindowContext({ stock: context.stock });

    myWindow.onContextUpdated((context) => {
        if (context) {
            setWindowContext({ stock: context.stock });
        };
    });
}

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

export const subscribeForSharedContext = (handler) => (io) => {
    io.contexts.subscribe(SHARED_CONTEXT_NAME, handler);
};