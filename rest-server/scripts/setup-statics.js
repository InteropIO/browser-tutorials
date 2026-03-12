const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const resources = [
    {
        source: path.join(__dirname, '../node_modules/@interopio/widget/dist'),
        destination: path.join(__dirname, '../resources/widget')
    }
]

const clearOldResources = () => {
    const destination = path.join(__dirname, '../resources');

    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
    }

    rimraf.sync(destination);
};

const copyApp = ({ source, destination }) => {
    fs.cpSync(source, destination, { recursive: true });
};

const copyResources = () => {
    clearOldResources();

    resources.forEach(({ source, destination }) => {
        copyApp({ source, destination });
    });
};

copyResources();
