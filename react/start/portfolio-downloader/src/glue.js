export const setupIntentListener = (setClientName) => (glue) => {
    const intentHandler = (context) => {

        if (context.type !== "ClientPortfolio") {
            return;
        };

        setClientName(context.data.clientName);
        startPortfolioDownload(context.data.clientName, context.data.portfolio);
    };

    // Pass `intentHandler()` to the `addIntentListener()` method.

};

const startPortfolioDownload = (clientName, portfolio) => {
    const dataToWrite = JSON.stringify({
        date: new Date(Date.now()).toLocaleString("en-US"),
        portfolio
    }, null, 4);

    const element = document.createElement("a");
    const blob = new Blob([dataToWrite], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    element.href = href;
    element.download = `${clientName ? clientName + "'s " : ""}Portfolio.json`;

    element.click();
    URL.revokeObjectURL(href);
};