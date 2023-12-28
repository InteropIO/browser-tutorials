const fetchAppDefinitions = async (url) => {
    const appDefinitionsResponse = await fetch(url);
    const appDefinitions = await appDefinitionsResponse.json();

    return appDefinitions;
};

const setupApplications = async (glue, { url }) => {
    // Call `fetchAppDefinitions()` and import the app definitions.

};