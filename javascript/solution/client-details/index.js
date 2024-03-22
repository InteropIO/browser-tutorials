const setFields = (client) => {
    const elementName = document.querySelectorAll("[data-name]")[0];
    elementName.innerText = client.name;

    const elementAddress = document.querySelectorAll("[data-address]")[0];
    elementAddress.innerText = client.address;

    const elementPhone = document.querySelectorAll("[data-phone]")[0];
    elementPhone.innerText = client.contactNumbers;

    const elementOccupation = document.querySelectorAll("[data-email]")[0];
    elementOccupation.innerText = client.email;

    const elementManager = document.querySelectorAll("[data-manager]")[0];
    elementManager.innerText = client.accountManager;
};

const toggleIOAvailable = () => {
    const span = document.getElementById("ioConnectSpan");

    span.classList.remove("label-warning");
    span.classList.add("label-success");
    span.textContent = "io.Connect is available";
};

const start = async () => {
    const config = {
        libraries: [IOWorkspaces]
    };
    const io = await IOBrowser(config);
    window.io = io;

    toggleIOAvailable();

    const myWorkspace = await io.workspaces.getMyWorkspace();

    if (myWorkspace) {
        myWorkspace.onContextUpdated((context) => {
            if (context.client) {
                setFields(context.client);
                myWorkspace.setTitle(context.client.name);
            };
        });
    };
};

start().catch(console.error);