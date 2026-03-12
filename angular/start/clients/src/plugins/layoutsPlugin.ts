const fetchWorkspaceLayoutDefinitions = async (url: string) => {
    const layoutDefinitionsResponse = await fetch(url);

    const layoutDefinitions = await layoutDefinitionsResponse.json();

    return layoutDefinitions;
};

export const setupLayouts = async () => {

};
