const fetchAppDefinitions = async (url) => {
    const appDefinitionsResponse = await fetch(url);
    const appDefinitions = await appDefinitionsResponse.json();

    return appDefinitions;
};

const setupApplications = async (io, { url }) => {
    try {
        const appDefinitions = await fetchAppDefinitions(url);

        await io.appManager.inMemory.import(appDefinitions);
    } catch(error) {
        console.error(error.message);
    };
};