const fetchAppDefinitions = async (url) => {
    const appDefinitionsResponse = await fetch(url);
    const appDefinitions = await appDefinitionsResponse.json();

    return appDefinitions;
};

const setupApplications = async (io, { url }) => {
    // TODO Chapter 8.2
};