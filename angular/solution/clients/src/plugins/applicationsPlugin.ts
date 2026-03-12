import { IOConnectBrowser } from "@interopio/browser";

const fetchAppDefinitions = async (url: string) => {
    const appDefinitionsResponse = await fetch(url);

    const appDefinitions = await appDefinitionsResponse.json();

    return appDefinitions;
};

export const setupApplications = async (
    io: IOConnectBrowser.API,
    config: { url: string }
) => {
    try {
        const appDefinitions = await fetchAppDefinitions(config.url);

        await io.appManager.inMemory.import(appDefinitions);
    } catch (error) {
        console.error(JSON.stringify(error));
    }
};
