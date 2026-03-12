import { IOConnectBrowser } from "@interopio/browser";

const fetchWorkspaceLayoutDefinitions = async (url: string) => {
    const layoutDefinitionsResponse = await fetch(url);

    const layoutDefinitions = await layoutDefinitionsResponse.json();

    return layoutDefinitions;
};

export const setupLayouts = async (
    io: IOConnectBrowser.API,
    config: { url: string }
) => {
    try {
        const layoutDefinitions = await fetchWorkspaceLayoutDefinitions(
            config.url
        );

        await io.layouts.import(layoutDefinitions);
    } catch (error) {
        console.error(JSON.stringify(error));
    }
};
