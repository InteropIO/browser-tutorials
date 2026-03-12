const fetchAppDefinitions = async (url: string) => {
    const appDefinitionsResponse = await fetch(url);

    const appDefinitions = await appDefinitionsResponse.json();

    return appDefinitions;
};

export const setupApplications = async () => {

};
