const fetchWorkspaceLayoutDefinitions = async (url) => {
    const layoutDefinitionsResponse = await fetch(url);
    const layoutDefinitions = await layoutDefinitionsResponse.json();

    return layoutDefinitions;
};

const setupLayouts = async (io, { url }) => {
    try {
        const layoutDefinitions = await fetchWorkspaceLayoutDefinitions(url);

        await io.layouts.import(layoutDefinitions);
    } catch (error) {
        console.error(error.message);
    };
};