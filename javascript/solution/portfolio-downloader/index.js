const intentHandler = (context) => {
    if (!context) {
        return;
    };

    setupTitle(context.data.clientName);

    const dataToWrite = JSON.stringify({
        date: new Date(Date.now()).toLocaleString("en-US"),
        portfolio: context.data.portfolio
    }, null, 4);
    const blob = new Blob([dataToWrite], { type: "application/json" });
    const download = document.getElementById("download");
    const href = URL.createObjectURL(blob);

    download.href = href;
    download.click();
    URL.revokeObjectURL(href);
};

const setupTitle = (clientName) => {
    const title = document.getElementById("portfolioName");
    title.innerText = `Downloading the portfolio of ${clientName}...`;
};

const toggleIOAvailable = () => {
    const span = document.getElementById("ioConnectSpan");

    span.classList.remove("label-warning");
    span.classList.add("label-success");
    span.textContent = "io.Connect is available";
};

async function start() {
    const io = await IOBrowser();
    window.io = io;

    toggleIOAvailable();

    io.intents.register("ExportPortfolio", intentHandler);
};

start().catch(console.error);