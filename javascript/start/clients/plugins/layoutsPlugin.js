const fetchWorkspaceLayoutDefinitions = async (url) => {
    const layoutDefinitionsResponse = await fetch(url);
    const layoutDefinitions = await layoutDefinitionsResponse.json();

    return layoutDefinitions;
};

export const setupLayouts = async (io, { url }) => {
    // TODO Chapter 9.2
};