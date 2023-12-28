## Overview

This tutorial is designed to walk you through every aspect of [**Glue42 Core**](https://glue42.com/core/) - setting up a project, initializing a [Main app](../../developers/core-concepts/web-platform/overview/index.html), multiple [Web Client](../../developers/core-concepts/web-client/overview/index.html) apps and extending your apps with [Shared Contexts](../../capabilities/data-sharing-between-apps/shared-contexts/index.html), [Interop](../../capabilities/data-sharing-between-apps/interop/index.html), [Window Management](../../capabilities/windows/window-management/index.html), [Channels](../../capabilities/data-sharing-between-apps/channels/index.html), [App Management](../../capabilities/application-management/index.html), [Workspaces](../../capabilities/windows/workspaces/overview/index.html) and more Glue42 [capabilities](../../capabilities/application-management/index.html).

This guide uses plain JavaScript and its goal is to allow you to put the basic concepts of [**Glue42 Core**](https://glue42.com/core/) to practice. There are also [React](../react/index.html) and [Angular](../angular/index.html) tutorials for [**Glue42 Core**](https://glue42.com/core/), but it's recommended that you go through the JavaScript tutorial first in order to get acquainted with [**Glue42 Core**](https://glue42.com/core/) without the distractions of additional libraries and frameworks.

## Introduction

You are a part of the IT department of a big multi-national bank and you have been tasked to lead the creation of a project which will be used by the Asset Management department of the bank. The project will consist of two apps:

- **Clients** - displays a full list of clients and details about them;
- **Stocks** - displays a full list of stocks with prices. When the user clicks on a stock, details about the selected stock should be displayed;

All apps are being developed by different teams within the organizations and therefore are being hosted at different origins.

As an end result, the users want to be able to run the apps as Progressive Web Apps in separate windows in order to take advantage of their multi-monitor setups. Also, they want the apps, even though in separate windows, to be able to communicate with each other. For example, when a client is selected in the **Clients** app, the **Stocks** app should display only the stocks of the selected client.

## Prerequisites

This tutorial assumes that you are familiar with the concepts of JavaScript and asynchronous programming.

It is also recommended to have the [Web Platform](../../developers/core-concepts/web-platform/overview/index.html), [Web Client](../../developers/core-concepts/web-client/overview/index.html) and [Glue42 Web](../../reference/core/latest/glue42%20web/index.html) documentation available for reference.

Each main chapter demonstrates a different Glue42 capability whose documentation you can find in the [Capabilities](../../capabilities/application-management/index.html) section of the documentation.

## Tutorial Structure

The tutorial code is located in the [**Glue42 Core**](https://glue42.com/core/) [GitHub repo](https://github.com/Glue42/core). There you will find a `/tutorials` directory with the following structure:

```cmd
/tutorials
    /angular
        /solution
        /start
    /guides
        /01_javascript
        /02_react
        /03_angular
    /javascript
        /solution
        /start
    /react
        /solution
        /start
    /rest-server
```

| Directory | Description |
|-----------|-------------|
| `/guides` | Contains the text files of the tutorials. |
| `/javascript`, `/react` and `/angular` | Contain the starting files for the tutorials and also a full solution for each of them. |
| `/rest-server` | A simple server used in the tutorials to serve the necessary JSON data. |

[**Glue42 Core**](https://glue42.com/core/) is an open-source project, so all feedback and contributions, both to the code base and the tutorials, are welcome.

## 1. Initial Setup

Clone the [**Glue42 Core**](https://glue42.com/core/) [GitHub repo](https://github.com/Glue42/core) to get the tutorial files.

### 1.1. Start Files

Next, go to the `/tutorials/javascript/start` directory which contains the starting files for the project. The tutorial examples assume that you will be working in the `/start` directory, but you can also move the files and work from another directory.

The `/start` directory contains the following:

| Directory | Description |
|-----------|-------------|
| `/clients` | This is the **Clients** app.  The directory contains everything necessary for this app to be a standalone PWA:  an `index.html` file, a script file, a `manifest.json` file, `/lib` directory, `/assets` directory, a `service-worker.js` and a favicon. Also contains a `/plugins` directory with Glue42 [Plugins](../../capabilities/plugins/index.html) that will be used in the [Plugins](#8_plugins) chapter. |
| `/stocks` | This is the **Stocks** app. The directory contains everything necessary for this app to be a standalone PWA:  an `index.html` file, a script file, a `manifest.json` file, `/lib` directory, `/assets` directory, a `service-worker.js` and a favicon. It also contains a **Stock Details** view in the `/stock/details` directory. |
| `/client-details` | This is the **Client Details** app which will be used later in the tutorial (in the [Workspaces](#9_workspaces) chapter) to display detailed information about a selected client. The directory contains everything necessary for this app to be a standalone PWA:  an `index.html` file, a script file, a `manifest.json` file, `/lib` directory, `/assets` directory, a `service-worker.js` and a favicon. |
| `/portfolio-downloader` | This is the **Portfolio Downloader** app, which will be used in the [Intents](#10_intents) chapter.  |
| `/workspace` | This is a **Workspaces App**, which will be used in the [Workspaces](#9_workspaces) chapter. |
| `package.json` | Standard `package.json` file. |

All apps are fully functional. To run them, execute the following commands:

```cmd
npm install
npm start
```

This will install the necessary dependencies and launch separate servers hosting all apps as follows:

| URL | App |
|-----|-----|
| `http://localhost:9000/` | **Clients** |
| `http://localhost:9100/` | **Stocks** |
| `http://localhost:9200/` | **Client Details** |
| `http://localhost:9300/` | **Workspaces App** |
| `http://localhost:9400/` | **Portfolio Downloader** |

### 1.2. Solution Files

Before you continue, take a look at the solution files. You are free to use the solution as you like - you can check after each section to see how it solves the problem, or you can use it as a reference point in case you get stuck.

Go to the `/rest-server` directory and start the REST Server (as described in the [REST Server](#1_initial_setup-13_rest_server) chapter). Go to the `/javascript/solution` directory, open a command prompt and run the following commands to install the necessary dependencies and run the project:

```cmd
npm install
npm start
```

You can now access the entry point of the project (the **Clients** app) at `http://localhost:9000/`.

### 1.3. REST Server

Before starting with the project, go to the `/rest-server` directory and start the REST server that will host the necessary data for the apps:

```cmd
npm install
npm start
```

This will launch the server at port 8080.

## 2. Project Setup

### 2.1. Main App

Every [**Glue42 Core**](https://glue42.com/core/) project must have a single central app called [Main app](../../developers/core-concepts/web-platform/overview/index.html) or Web Platform app. In a real-life scenario this would be an app used for discovering and listing available apps, Workspaces, handling notifications and much more. However, your goal now is to learn about all these aspects with as little complexity as possible. That's why the **Clients** app will serve as your Main app. The users will open the **Clients** app and from there they will be able to click on a client and see their stocks and so on.

Setting up a Main app is as simple as calling a function. First, reference the [@glue42/web-platform](https://www.npmjs.com/package/@glue42/web-platform) script in the **Clients** app and then initialize the library. The Web Platform library handles the entire Glue42 environment, which is necessary for the [Web Client](../../developers/core-concepts/web-client/overview/index.html) apps to be able to connect to the Main app and to each other.

Open the `index.html` of the **Clients** app, add a new `<script>` tag below the `TODO: Chapter 2` comment and reference the [@glue42/web-platform](https://www.npmjs.com/package/@glue42/web-platform) script from the `/clients/lib` directory:

```html
<script src="/lib/platform.web.umd.js"></script>
```

Next, open the `index.js` file of the **Clients** app and find the `TODO: Chapter 2` comment inside the `start()` function. [Initialize](../../developers/core-concepts/web-platform/setup/index.html#initialization) the [@glue42/web-platform](https://www.npmjs.com/package/@glue42/web-platform) library by using the `GlueWebPlatform()` factory function attached to the global `window` object. Assign the `glue` property of the returned object as a property of the global `window` object for easy use later:

```javascript
// In `start()`.

const { glue } = await GlueWebPlatform();
window.glue = glue;
```

Find the `toggleGlueAvailable()` function marked with a `TODO: Chapter 2` comment and uncomment it. Call it once the `GlueWebPlatform()` factory function has resolved.

```javascript
// In `start()`.

toggleGlueAvailable();
```

After refreshing the app, you should see in the top left corner that Glue42 is available. This means that you have successfully initialized the [Main app](../../developers/core-concepts/web-platform/overview/index.html).

Next, initialize the rest of the apps to connect them to Glue42 as [Web Clients](../../developers/core-concepts/web-client/overview/index.html).

### 2.2. Web Clients

Now that you have a fully functional [Main app](../../developers/core-concepts/web-platform/overview/index.html), you must [initialize](../../developers/core-concepts/web-client/javascript/index.html#initialization) the [Glue42 Web](../../reference/core/latest/glue42%20web/index.html) library in the rest of the apps. This will allow them to connect to the **Clients** app and communicate with each other.

Open the `index.html` files of the **Stocks**, **Stock Details**, **Client Details** and **Portfolio Downloader** apps, add a new `<script>` tag below the `TODO: Chapter 2` comment and reference the Glue42 Web script from the `/lib` directory:

```html
<script src="/lib/web.umd.js"></script>
```

Next, open the `index.js` files of the **Stocks**, **Stock Details**, **Client Details** and **Portfolio Downloader** apps and find the `TODO: Chapter 2` comment inside the `start()` function. Initialize the [Glue42 Web](../../reference/core/latest/glue42%20web/index.html) library by using the `GlueWeb()` factory function attached to the global `window` object. Assign the returned object as a property of the global `window` object for easy use:

```javascript
// In `start()`.

const glue = await GlueWeb();
window.glue = glue;
```

*Note that the `GlueWeb()` factory function returns directly a `glue` object unlike the `GlueWebPlatform()` factory function, which returns it wrapped in an object.*

Find the `toggleGlueAvailable()` function marked with a `TODO: Chapter 2` comment and uncomment it. Call it once the `GlueWeb()` factory function has resolved.

```javascript
// In `start()`.

toggleGlueAvailable();
```

*Note that when you refresh these apps, you will see that the Glue42 initialization is unsuccessful. This is because they can't currently connect to the Glue42 environment provided by the [Main app](../../developers/core-concepts/web-platform/overview/index.html) and therefore can't discover the Main app or each other. To be able to initialize the [Glue42 Web](../../reference/core/latest/glue42%20web/index.html) library, all [Web Client](../../developers/core-concepts/web-client/overview/index.html) apps must be started through the [Main app](../../developers/core-concepts/web-platform/overview/index.html) or by another [Web Client](../../developers/core-concepts/web-client/overview/index.html) app already connected to the Glue42 environment.*

To verify that the initializations are correct, open the browser console of the **Clients** app (press `F12`) and execute the following:

```javascript
await glue.windows.open("stocks", "http://localhost:9100/").catch(console.error);
```

This will instruct the **Clients** app to open the **Stocks** app using the Glue42 [Window Management API](../../capabilities/windows/window-management/index.html). The **Stocks** app will now be able to connect to the Glue42 environment and initialize the [Glue42 Web](../../reference/core/latest/glue42%20web/index.html) library correctly. Repeat this for the rest of the apps by changing the values of the `name` and the `url` parameters when calling the [`open()`](../../capabilities/windows/window-management/index.html#API-open) method.

Next, you will begin to add Glue42 functionalities to the apps.

## 3. Window Management

The goal of this chapter is to stat building the user flow of the entire project. The end users will open the **Clients** app and will be able to open the **Stocks** app from the "Stocks" button in it. Clicking on a stock in the **Stocks** app will open the **Stock Details** app.

Currently, the only way for the user to open the **Stocks** app is to manually enter its URL in the address bar. This, however, prevents the app from connecting to the Glue42 environment. Also, the **Stock Details** app is currently a separate view of the **Stocks** app. The end users have multiple monitors and would like to take advantage of that - they want clicking on a stock to open a new window with the respective app. The new window for the selected stock must also have specific dimensions and position. To achieve all this, you will use the [Window Management API](../../reference/core/latest/windows/index.html).

*See also the [Capabilities > Windows > Window Management](../../capabilities/windows/window-management/index.html) documentation.*

### 3.1. Opening Windows at Runtime

Instruct the **Clients** app to open the **Stocks** app in a new window when the user clicks on the "Stocks" button. Locate the `TODO: Chapter 3.1` comment inside the `stocksButtonHandler()` function. Use the [`open()`](../../reference/core/latest/windows/index.html#API-open) method to open the **Stocks** app in a new window. The `instanceID` and `counter` variables ensure that the name of each new **Stocks** instance will be unique:

```javascript
const stocksButtonHandler = (client) => {

    // The `name` and `url` parameters are required. The window name must be unique.
    const name = `Stocks-${instanceID || counter}`;
    const URL = "http://localhost:9100/";

    glue.windows.open(name, URL).catch(console.error);
};
```


Clicking on the "Stocks" button will now open the **Stocks** app.

To complete the user flow, instruct the **Stocks** app to open a new window each time a the user clicks on a stock. Remember that each Glue42 Window must have a unique name. To avoid errors resulting from attempting to open Glue42 Windows with conflicting names, check whether the clicked stock has already been opened in a new window.

Go to the **Stocks** app and find the `TODO: Chapter 3.1` comment in the `stockClickedHandler()` function. Currently, it rewrites the value of `window.location.href` to redirect to the **Stock Details** view. Remove that and use the [`open()`](../../reference/core/latest/windows/index.html#API-open) method instead. Use the [`list()`](../../reference/core/latest/windows/index.html#API-list) method to get a collection of all Glue42 Windows and check whether the clicked stock is already open in a window. It's safe to search by `name`, because all Glue42 Window instances must have a unique `name` property:

```javascript
const stockClickedHandler = (stock) => {
    const name = `${stock.BPOD} Details`;
    const URL = "http://localhost:9100/details/";

    // Check whether the clicked stock has already been opened in a new window.
    const stockWindowExists = glue.windows.list().find(w => w.name === name);

    if (!stockWindowExists) {
        glue.windows.open(name, URL).catch(console.error);
    };
};
```

After refreshing, when you click on a stock, a separate **Stock Details** window will be opened. The selected stock will be passed later as a window context - all fields in the **Stock Details** app are currently empty.

*Note that you must allow popups in the browser and/or remove any popup blockers to allow the **Stock Details** window to open.*

### 3.2. Window Settings

To position the new **Stock Details** window, extend the logic in the [`open()`](../../reference/core/latest/windows/index.html#API-open) method by passing an optional [`Settings`](../../reference/core/latest/windows/index.html#Settings) object containing specific values for the window size (`width` and `height`) and position (`top` and `left`):

```javascript
const stockClickedHandler = (stock) => {
    const name = `${stock.BPOD} Details`;
    const URL = "http://localhost:9100/details/";
    // Optional configuration object for the newly opened window.
    const config = {
        left: 100,
        top: 100,
        width: 550,
        height: 550
    };

    const stockWindowExists = glue.windows.list().find(w => w.name === name);

    if (!stockWindowExists) {
        glue.windows.open(name, URL, config).catch(console.error);
    };
};
```

### 3.3. Window Context

To allow the **Stock Details** app to display information about the selected stock, pass the `stock` object in the **Stocks** app as a context to the newly opened **Stock Details** window. The **Stock Details** window will then access its context and extract the necessary stock information.

Add a `context` property to the window configuration object and assign the `stock` object as its value:

```javascript
const stockClickedHandler = (stock) => {
    const name = `${stock.BPOD} Details`;
    const URL = "http://localhost:9100/details/";
    const config = {
        left: 100,
        top: 100,
        width: 550,
        height: 550,
        // Set the `stock` object as a context for the new window.
        context: stock
    };

    const stockWindowExists = glue.windows.list().find(w => w.name === name);

    if (!stockWindowExists) {
        glue.windows.open(name, URL, config).catch(console.error);
    };
};
```

Update the **Stock Details** app to get the `stock` object. Find the `TODO: Chapter 3.3` comment in the **Stock Details** app. Get a reference to the current window using the [`my()`](../../reference/core/latest/windows/index.html#API-my) method and get its context with the [`getContext()`](../../reference/core/latest/windows/index.html#WebWindow-getContext) method of the Glue42 Window object:

```javascript
// In `start()`.

const myWindow = glue.windows.my();
const stock = await myWindow.getContext();
```

Now, when you click on a stock in the **Stocks** app, the **Stock Details** app will open in a new window displaying information about the selected stock.

## 4. Interop

Now, you will use the [Interop API](../../reference/core/latest/interop/index.html) to pass the portfolio of the selected client to the **Stocks** app and show only the stocks present in their portfolio.

*See also the [Capabilities > Data Sharing Between Apps > Interop](../../capabilities/data-sharing-between-apps/interop/index.html) documentation.*

### 4.1. Registering Interop Methods and Creating Streams

When a user clicks on a client, the **Stocks** app should show only the stocks owned by this client. You can achieve this by registering an Interop method in the **Stocks** app which, when invoked, will receive the portfolio of the selected client and re-render the stocks table. Also, the **Stocks** app will create an Interop stream to which it will push the new stock prices. Subscribers to the stream will get notified when new prices have been generated.

Go to the **Stocks** app and find the `TODO: Chapter 4.1` comment in the `start()` function. Use the [`register()`](../../reference/core/latest/interop/index.html#API-register) method to register an Interop method. Pass a method name (`"SelectClient"`) and a callback for handling method invocations to `register()`. The callback will expect as an argument an object with a `client` property, which in turn holds an object with a `portfolio` property. Filter all stocks and pass only the ones present in the portfolio of the client to the `setupStocks()` function.

Streams can be described as special Interop methods. Use the [`createStream()`](../../reference/core/latest/interop/index.html#API-createStream) method to create a stream called `"LivePrices"` and assign it to the global `window` object for easy access:

```javascript
// In `start()`.

// Define a method name and a callback that will handle method invocations.
const methodName = "SelectClient";
const methodHandler = (args) => {
    const clientPortfolio = args.client.portfolio;
    const stockToShow = stocks.filter(stock => clientPortfolio.includes(stock.RIC));

    setupStocks(stockToShow);
};

// Register an Interop method.
glue.interop.register(methodName, methodHandler);

// Create an Interop stream.
window.priceStream = await glue.interop.createStream("LivePrices");
```
Finally, go to the `newPricesHandler()` function and find the `TODO: Chapter 4.1` comment in it. This function is invoked every time new prices are generated. Push the updated prices to the stream if it exists:

```javascript
// Update the `newPricesHandler()` to push the new prices to the stream.
const newPricesHandler = (priceUpdate) => {
    priceUpdate.stocks.forEach((stock) => {
        const row = document.querySelectorAll(`[data-ric='${stock.RIC}']`)[0];

        if (!row) {
            return;
        };

        const bidElement = row.children[2];
        bidElement.innerText = stock.Bid;

        const askElement = row.children[3];
        askElement.innerText = stock.Ask;
    });

    // Check whether the stream exists and push the new prices to it.
    if (priceStream) {
        priceStream.push(priceUpdate);
    };
};
```

Next, you will find and invoke the registered method from the **Clients** app.

### 4.2. Method Discovery

Go to the **Clients** app, find the `TODO: Chapter 4.2.` comment and extend the `clientClickedHandler()`. This function is invoked every time the user clicks on a client. Use the [`methods()`](../../reference/core/latest/interop/index.html#API-methods) method to check for a registered Interop method with the name `"SelectClient"`:

```javascript
// In `clientClickedHandler()`.

// Get a list of all registered Interop methods and filter them by name.
const selectClientStocks = glue.interop.methods().find(method => method.name === "SelectClient");
```

### 4.3. Method Invocation

Next, invoke the Interop method if it has been registered.

Find the `TODO: Chapter 4.3.` comment and invoke the method if it has been registered. Use the [`invoke()`](../../reference/core/latest/interop/index.html#API-invoke) method and pass the previously found method object to it as a first argument. Wrap the `client` object received by the `clientClickedHandler()` in another object and pass it as a second argument to [`invoke()`](../../reference/core/latest/interop/index.html#API-invoke):

```javascript
// In `clientClickedHandler()`.

// Check if the method exists and invoke it.
if (selectClientStocks) {
    glue.interop.invoke(selectClientStocks, { client });
};
```

The updated handler should now look something like this:

```javascript
const clientClickedHandler = (client) => {
    const selectClientStocks = glue.interop.methods().find((method) => method.name === "SelectClient");

    if (selectClientStocks) {
        glue.interop.invoke(selectClientStocks, { client });
    };
};
```

Now, when you click on a client in the **Clients** app, the **Stocks** app will display only the stocks that are in the portfolio of the selected client.

### 4.4. Stream Subscription

Use the [Interop API](../../reference/core/latest/interop/index.html) to subscribe the **Stock Details** app to the previously created Interop stream.

Go to the **Stock Details** app and find the `TODO: Chapter 4.4` comment in the `start()` function. Use the [`subscribe()`](../../reference/core/latest/interop/index.html#API-subscribe) method to subscribe to the `"LivePrices"` stream and use the [`onData()`](../../reference/core/latest/interop/index.html#Subscription-onData) method of the returned subscription object to assign a handler for the received stream data:

```javascript
// In `start()`.

// Create a stream subscription.
const subscription = await glue.interop.subscribe("LivePrices");

// Define a handler for the received stream data.
const streamDataHandler = (streamData) => {
    const updatedStocks = streamData.data.stocks;
    const selectedStockPrice = updatedStocks.find(updatedStock => updatedStock.RIC === stock.RIC);

    updateStockPrices(selectedStockPrice.Bid, selectedStockPrice.Ask);
};

// Handle the received stream data.
subscription.onData(streamDataHandler);
```

*Note that each new instance of the **Stocks** app will create a new stream instance. In real-life scenarios, this should be handled differently - e.g., by a system app acting as a designated data provider. For more details, see [Plugins](../../capabilities/plugins/index.html).*

## 5. Shared Contexts

The next request of the users is to be able to see in the **Stock Details** app whether the selected client has the selected stock in their portfolio. This time you will use the [Shared Contexts API](../../reference/core/latest/shared%20contexts/index.html) to connect the **Clients**, **Stocks** and **Stock Details** apps through shared context objects.

*See also the [Capabilities > Data Sharing Between Apps > Shared Contexts](../../capabilities/data-sharing-between-apps/shared-contexts/index.html) documentation.*

### 5.1. Updating a Context

Go to the **Clients** app and find the `TODO: Chapter 5.1.` comment in the `clientClickedHandler()` function. Comment out or delete the existing code that uses the Interop API. Use the [`update()`](../../reference/core/latest/shared%20contexts/index.html#API-update) method to create and set a shared context object by providing a name and value - it will hold the selected client object. Other apps will be able to subscribe for updates to this context and be notified when its value changes:

```javascript
const clientClickedHandler = (client) => {
    // The `update()` method updates the value of a specified context object.
    // If the specified context doesn't exist, it will be created.
    glue.contexts.update("SelectedClient", client).catch(console.error);
};
```

### 5.2. Subscribing for Context Updates

Next, go to the **Stocks** app and find the `TODO: Chapter 5.2` comment in the `start()` function. Comment out or delete the code that uses the Interop API to register the method `"SelectClient"` (but leave the code that registers the `"LivePrices"` stream). Use the [`subscribe()`](../../reference/core/latest/shared%20contexts/index.html#API-subscribe) method to subscribe for updates to the `"SelectedClient"` context object:

```javascript
// In `start()`.

// Define a function that will handle the context updates.
const updateHandler = (client) => {
    const clientPortfolio = client.portfolio;
    const stockToShow = stocks.filter(stock => clientPortfolio.includes(stock.RIC));

    setupStocks(stockToShow);
};

// Subscribe for updates to the context.
glue.contexts.subscribe("SelectedClient", updateHandler);
```

Go to the `index.html` file of the **Stock Details** app, find the `TODO: Chapter 5.2` comment and uncomment the `<div>` that will hold the client status. Go to the `index.js` file and uncomment the `updateClientStatus()` function. Find the `TODO: Chapter 5.2` comment in the `start()` function and subscribe for the `"SelectedClient"` context. Invoke the `updateClientStatus()` function and pass the selected client and stock to it:

```javascript
// In `start()`.

// Define a function that will handle the context updates.
const updateHandler = (client) => {
    updateClientStatus(client, stock);
};

// Subscribe for updates to the context.
glue.contexts.subscribe("SelectedClient", updateHandler);
```

Now, the **Stock Details** app will show whether the client selected from the **Clients** app has the the displayed stock in their portfolio.

## 6. Channels

The latest requirement from the users is to be able to work with multiple clients at a time by having multiple instances of the **Stocks** app show the portfolios of different clients. Currently, no matter how many instances of the **Stocks** app are running, they are all listening for updates to the same context and therefore all show information about the same selected client. Here you will use the [Channels API](../../reference/core/latest/channels/index.html) to allow each instance of the **Stocks** app to subscribe for updates to the context of a different Channel. The different Channels are color-coded and the user will be able to select a Channel from a Channel Selector UI. The **Clients** app will update the context of the currently selected Channel when the user clicks on a client.

*See also the [Capabilities > Data Sharing Between Apps > Channels](../../capabilities/data-sharing-between-apps/channels/index.html) documentation.*

### 6.1. Channels Configuration

The [Main app](../../developers/core-concepts/web-platform/overview/index.html) (the **Clients** app in this project) handles the configuration of the Glue42 environment. The `GlueWebPlatform()` factory function accepts an optional configuration object that allows you to enable, disable and configure various Glue42 features. Here, you will use it to define the available Glue42 Channels.

Find the `TODO: Chapter 6.1` comment in the **Clients** app, define a configuration object and pass it to `GlueWebPlatform()`:

```javascript
// In start().

// Define Glue42 Channels.
const channels = {
    definitions: [
        {
            name: "Red",
            meta: {
                color: "red"
            }
        },
        {
            name: "Green",
            meta: {
                color: "green"
            }
        },
        {
            name: "Blue",
            meta: {
                color: "#66ABFF"
            }
        },
        {
            name: "Pink",
            meta: {
                color: "#F328BB"
            }
        },
        {
            name: "Yellow",
            meta: {
                color: "#FFE733"
            }
        },
        {
            name: "Dark Yellow",
            meta: {
                color: "#b09b00"
            }
        },
        {
            name: "Orange",
            meta: {
                color: "#fa5a28"
            }
        },
        {
            name: "Purple",
            meta: {
                color: "#c873ff"
            }
        },
        {
            name: "Lime",
            meta: {
                color: "#8af59e"
            }
        },
        {
            name: "Cyan",
            meta: {
                color: "#80f3ff"
            }
        }
    ]
};

// Define the configuration object and pass it to the factory function.
const config = { channels };
const { glue } = await GlueWebPlatform(config);
window.glue = glue;
```

When the **Clients** app starts, the defined Channels will be initialized and ready for interaction.

### 6.2. Channel Selector Widget

The users have to be able to navigate through the Channels for which they will need some sort of user interface. You can create your own Channel selector widget by using the Channels API, but for the purpose of the tutorial, the widget is provided. To add it to the **Clients** and **Stocks** apps, follow these steps:

1. Go to the `index.html` files of both apps and find the `TODO: Chapter 6.2` comments in the `<head>` tag. Reference the `channelSelectorWidget.js` file located in the `/lib` folder:

```html
<script src="/lib/channelSelectorWidget.js"></script>
```

2. Next, find the other `TODO: Chapter 6.2` comment in the `<body>` tag and uncomment the `<select>` element. It will be populated by the Channel selector widget script.

3. Find the `TODO: Chapter 6.2` comment in the `index.js` files of both apps and call the globally exposed `createChannelSelectorWidget()` function to populate the Channel selector widget. The `createChannelSelectorWidget()` method expects three arguments:

- `NO_CHANNEL_VALUE` - a string for the default value to be displayed in the widget. The users will use it to leave the current Channel:

```javascript
// In `start()`.

// Define and initialize the variable that will be used as a first argument.
const NO_CHANNEL_VALUE = "No channel";
```

- `channelNamesAndColors` - an array of objects with `name` and `color` properties holding the name and the color code of each Channel. You will get them using the [`list()`](../../reference/core/latest/channels/index.html#API-list) method of the Channels API:

```javascript
// In `start()`.

// Get the contexts of all available Channels.
const channelContexts = await window.glue.channels.list();
// Extract only the names and colors of the Channels.
const channelNamesAndColors = channelContexts.map((channelContext) => {
    const channelInfo = {
        name: channelContext.name,
        color: channelContext.meta.color
    };

    return channelInfo;
});
```

- `onChannelSelected` - a callback that will be called when the user selects a Channel from the widget. Use the [`my()`](../../reference/core/latest/channels/index.html#API-my) method to get a reference to the current Channel and the [`join()`](../../reference/core/latest/channels/index.html#API-join) and [`leave()`](../../reference/core/latest/channels/index.html#API-leave) methods to switch between Channels:

```javascript
// In `start()`.

const onChannelSelected = (channelName) => {
    // Leave the current Channel when the user selects "No Channel".
    if (channelName === NO_CHANNEL_VALUE) {
        if (glue.channels.my()) {
            glue.channels.leave().catch(console.error);
        };
    } else {
        // Join the Channel selected by the user.
        glue.channels.join(channelName).catch(console.error);
    };
};
```

Finally, pass these arguments to `createChannelSelectorWidget()`:

```javascript
// In `start()`.

createChannelSelectorWidget(
    NO_CHANNEL_VALUE,
    channelNamesAndColors,
    onChannelSelected
);
```

Refresh both apps to see the Channel selector widget.

### 6.3. Publishing and Subscribing

Next, you need to enable the **Clients** app to publish updates to the current Channel context and the **Stocks** app to subscribe for these updates.

Find the `TODO: Chapter 6.3.` comment in the `clientClickedHandler()` function of the **Clients** app. Use the [`publish()`](../../reference/core/latest/channels/index.html#API-publish) method and pass the selected client as an argument to update the Channel context when a new client is selected. Note that `publish()` will throw an error if the app tries to publish data but isn't on a Channel. Use the [`my()`](../../reference/core/latest/channels/index.html#API-my) method to check for the current Channel:

```javascript
// In `clientClickedHandler()`.

const currentChannel = glue.channels.my();

if (currentChannel) {
    glue.channels.publish(client).catch(console.error);
};
```

Next, go to the **Stocks** app and comment out or delete the code in the `start()` function that uses the Shared Contexts API to listen for updates of the `"SelectedClient"` context. Find the `TODO: Chapter 6.3` comment and use the [`subscribe()`](../../reference/core/latest/channels/index.html#API-subscribe) method instead to enable the **Stocks** app to listen for updates of the current Channel context. Provide the same callback you used in Chapter 5.2. to handle context updates, but modify it to check for the client portfolio. This is necessary in order to avoid errors if the user decides to change the Channel of the **Stocks** app manually - the context of the new Channel will most likely be an empty object, which will lead to `undefined` values:

```javascript
// In `start()`.

const updateHandler = (client) => {
    if (client.portfolio) {
        const clientPortfolio = client.portfolio;
        const stockToShow = stocks.filter(stock => clientPortfolio.includes(stock.RIC));

        setupStocks(stockToShow);
    };
};

glue.channels.subscribe(updateHandler);
```

Now when the **Clients** and the **Stocks** apps are on the same Channel, the **Stocks** app will be updated with the portfolio of the selected client.

## 7. App Management

Up until now, you had to use the Window Management API to open new windows when the user clicks on the "Stocks" button in the **Clients** app or on a stock in the **Stocks** app. This works fine for small projects, but doesn't scale well for larger ones, because this way each app must know all details (URL, start position, initial context, etc.) of every app it starts. In this chapter, you will replace the Window Management API with the [App Management API](../../reference/core/latest/appmanager/index.html) which will allow you to predefine all available apps when initializing the [Main app](../../developers/core-concepts/web-platform/overview/index.html). The **Clients** app will be decoupled from the **Stocks** app and the **Stocks** app will be decoupled from **Stock Details** - you will need only the names of the apps to be able to start them.

*See also the [Capabilities > App Management](../../capabilities/application-management/index.html) documentation.*

### 7.1. App Configuration

To take advantage of the [App Management API](../../reference/core/latest/appmanager/index.html), define configurations for your apps. Go to the **Clients** app and define an `applications` property in the configuration object passed to `GlueWebPlatform()` containing all required definitions:

```javascript
// In `start()`.

// Define app configurations.
const applications = {
    local: [
        {
            name: "Clients",
            type: "window",
            details: {
                url: "http://localhost:9000/"
            }
        },
        {
            name: "Stocks",
            type: "window",
            details: {
                url: "http://localhost:9100/",
                left: 0,
                top: 0,
                width: 860,
                height: 600
            }
        },
        {
            name: "Stock Details",
            type: "window",
            details: {
                url: "http://localhost:9100/details",
                left: 100,
                top: 100,
                width: 400,
                height: 400
            }
        },
        {
            name: "Client Details",
            type: "window",
            details: {
                url: "http://localhost:9200/"
            }
        }
    ]
};
const config = { channels, applications };
const { glue } = await GlueWebPlatform(config);
window.glue = glue;
```

The `name` and `url` properties are required when defining an app configuration object. As you see, the position and size of the app windows is now defined in their configuration.

### 7.2. Starting Apps

Go the the **Clients** app and remove the code in the `stocksButtonHandler()` using the Window Management API (including the code related to the `counter` and `instanceID` variable, as it won't be necessary to create unique window names). Find the `TODO: Chapter 7.2` comment, get the **Stocks** app object with the [`application()`](../../reference/core/latest/appmanager/index.html#API-application) method and use its [`start()`](../../reference/core/latest/appmanager/index.html#Application-start) method to start the **Stocks** app when the user clicks the "Stocks" button. Pass the current Channel as context to the started instance:

```javascript
// In `stocksButtonHandler()`.

const stocksApp = glue.appManager.application("Stocks")
const currentChannel = glue.channels.my();

stocksApp.start({ channel: currentChannel }).catch(console.error);
```

Now go to the **Stocks** app, find the `TODO: Chapter 7.2` comment and use the following to receive and join the Channel:

```javascript
// In `start()`.

const appContext = await glue.appManager.myInstance.getContext();
const channelToJoin = appContext.channel;

if (channelToJoin) {
    await glue.channels.join(channelToJoin);
};
```

This, however, won't re-render the Channel selector widget in the **Stocks** app with the newly programmatically joined Channel. To make the Channel selector react to calls to [`join()`](../../reference/core/latest/channels/index.html#API-join) and [`leave()`](../../reference/core/latest/channels/index.html#API-leave), assign the `createChannelSelectorWidget()` function to a variable - it returns a function which can be used to re-render the widget every time the current Channel has changed. Use the [`onChanged()`](../../reference/core/latest/channels/index.html#API-onChanged) method to subscribe for changes of the current Channel. Note that the app must subscribe for changes of the Channel before actually joining the Channel, in order for the event to be triggered when the **Stocks** app joins a Channel for the first time:

```javascript
// In `start()`.

// The `createChannelSelectorWidget()` function returns a function which
// accepts the new Channel name as an argument and updates the widget.
const updateChannelSelectorWidget = createChannelSelectorWidget(
    NO_CHANNEL_VALUE,
    channelNamesAndColors,
    onChannelSelected
);

// Re-render the Channel selector each time the Channel changes.
const handleChannelChanges = (channelName) => {
    updateChannelSelectorWidget(channelName || NO_CHANNEL_VALUE);
};

// This subscription must happen before joining a Channel.
glue.channels.onChanged(handleChannelChanges);
```

### 7.3. App Instances

Finally, find the `TODO: Chapter 7.3` comment in the `stockClickedHandler()`. Comment out or delete the code that uses the Window Management API to open the **Stock Details** app. Use the [`application()`](../../reference/core/latest/appmanager/index.html#API-application) method to get the **Stock Details** app. Check whether an instance with the selected stock has already been started by iterating over the contexts of the existing **Stock Details** instances. If there is no instance with the selected stock, call the `start()` method on the app object and pass the selected stock as a context:

```javascript
// In `stockClickedHandler()`.

const detailsApplication = glue.appManager.application("Stock Details");

// Check whether an instance with the selected stock is already running.
const contexts = await Promise.all(
    // Use the `instances` property to get all running app instances.
    detailsApplication.instances.map(instance => instance.getContext())
);
const isRunning = contexts.find(context => context.RIC === stock.RIC);

if (!isRunning) {
    // Start the app and pass the `stock` as context.
    detailsApplication.start(stock).catch(console.error);
};
```

Go to the **Stock Details** app, comment out or delete the code that uses the window context to get the stock object and use the App Management API instead to get the context of the current app instance:

```javascript
// In `start()`.

const stock = await glue.appManager.myInstance.getContext();
```

Everything works as before, the difference being that the apps now use the App Management API instead of the Window Management API.

## 8. Plugins

The developer team has decided against hard coding app definitions, as in practice it's more scalable to fetch them from a web service. The Glue42 [Plugins](../../capabilities/plugins/index.html) allow you to execute initial system logic contained in a custom function with access to the `glue` object. You can also configure the [Main app](../../developers/core-concepts/web-platform/overview/index.html) whether to wait for the execution of the Plugin to complete before initialization. This will enable you to fetch and import the app definitions on startup of the Main app, but before the initialization of the [@glue42/web-platform](https://www.npmjs.com/package/@glue42/web-platform) library has completed, so that they are available to the Glue42 framework when the user starts the Main app.

*See also the [Capabilities > Plugins](../../capabilities/plugins/index.html) documentation.*

### 8.1. Defining a Plugin

Go to the **Clients** app, comment out or delete the previously declared app definitions and remove the `applications` property from the library configuration object.

Next, configure the Plugin in the Main app by using the `plugins` property of the [@glue42/web-platform](https://www.npmjs.com/package/@glue42/web-platform) configuration object. Plugin are defined in the `definitions` array of the `plugins` object. Set a name for the Plugin and pass a reference to the `setupApplications()` function in the `start` property of the Plugin object. Use the optional `config` object to pass the URL from which to fetch the app definitions. Set the `critical` property to `true` to instruct the Main app to wait for the Plugin to execute before the Web Platform initialization completes:

```javascript
// In `start()`.

// Define a Plugin.
const plugins = {
    definitions: [
        {
            name: "Setup Applications",
            config: { url: "http://localhost:8080/api/applications"},
            start: setupApplications,
            critical: true
        }
    ]
};

const config = { channels, plugins };
const { glue } = await GlueWebPlatform(config);
window.glue = glue;
```

### 8.2. Implementing a Plugin

Go to the `index.html` file of the **Clients** app, find the `TODO Chapter 8.2` comment and reference the `applicationsPlugin.js` script in the `/plugins` directory:

```html
<script src="/plugins/applicationsPlugin.js"></script>
```

Go to the `applicationsPlugin.js` file. The `setupApplications()` function will be the Plugin that will be executed on startup of the Main app. It will receive an initialized `glue` object as a first argument, and the `config` object from the Plugin definition as a second argument. From the `url` property of the `config` object you will extract the URL from which to fetch the app definitions.

Find the `TODO Chapter 8.2` comment in `setupApplications()` and call the `fetchAppDefinitions()` function, passing the URL as an argument. Store the fetched app definitions in a variable and use the [`import()`](../../reference/core/latest/appmanager/index.html#InMemory-import) method of the [`inMemory`](../../reference/core/latest/appmanager/index.html#InMemory) object of the App Management API to [import the app definitions at runtime](../../capabilities/application-management/index.html#managing_app_definitions_at_runtime):

```javascript
// In `setupApplications()`.

try {
    const appDefinitions = await fetchAppDefinitions(url);

    await glue.appManager.inMemory.import(appDefinitions);
} catch (error) {
    console.error(error.message);
};
```

From a user perspective, everything works as before, but by using a Plugin to fetch and import the app definitions at runtime, you have decoupled the Main app from the previously hard coded `applications` object.

Restart the **Clients** app for the changes to take effect.

## 9. Workspaces

The latest feedback from the users is that their desktops very quickly become cluttered with multiple floating windows. The [**Glue42 Core**](https://glue42.com/core/) [Workspaces](../../capabilities/windows/workspaces/overview/index.html) feature solves exactly that problem.

The new requirement is that when a user clicks on a client in the **Clients** app, a new Workspace is to open displaying detailed information about the selected client in one app and their stocks portfolio in another. When the user clicks on a stock, a third app is to appear in the same Workspace displaying more details about the selected stock. You will use the **Client Details** app for displaying information about the selected client.

Go to the `index.html` and `index.js` files of the **Clients** app and comment out or delete the "Stocks" button and the `stocksButtonHandler()`. Also remove all logic and references related to Channels from the **Clients** and **Stocks** apps that were introduced in a previous chapter.

Instead, you will use Workspaces to allow the users to work with multiple clients at once and organize their desktops at the same time. Channels and Workspaces can, of course, be used together to provide extremely enhanced user experience, but in order to focus entirely on working with Workspaces and the [Workspaces API](../../reference/core/latest/workspaces/index.html), the Channels functionality will be ignored.

*See also the [Capabilities > Windows > Workspaces](../../capabilities/windows/workspaces/overview/index.html) documentation.*

### 9.1. Setup

All Workspaces are contained in a specialized standalone web app called [Workspaces App](../../capabilities/windows/workspaces/overview/index.html#workspaces_concepts-frame). It's outside the scope of this tutorial to cover building and customizing this app, so you have a ready-to-go app located at `/workspace`. The Workspaces App is already being hosted at `http://localhost:9300/`.

### 9.2. Workspace Layouts

A [Workspace Layout](../../capabilities/windows/workspaces/overview/index.html#workspaces_concepts-workspace_layout) describes the apps participating in the Workspace and their arrangement. In a real-life scenario, Workspace Layouts, like app definitions, will most likely be fetched from a web service. Therefore, you can use another Glue42 [Plugin](../../capabilities/plugins/index.html) to fetch a Workspace Layout named "Client Space" that the **Clients** app will use as a blueprint for restoring a Workspace when the user clicks on a client.

*For more details on using Glue42 Plugins, see chapter [8. Plugins](#8_plugins).*

Go to the **Clients** app and define another Plugin that will fetch the Workspace Layout:

```javascript
// In `start()`.

const plugins = {
    definitions: [
        {
            name: "Setup Applications",
            config: { url: "http://localhost:8080/api/applications"},
            start: setupApplications,
            critical: true
        },
        {
            name: "Setup Workspace Layouts",
            config: { url: "http://localhost:8080/api/layouts"},
            start: setupLayouts,
            critical: true
        }
    ]
};

const config = { channels, plugins };
const { glue } = await GlueWebPlatform(config);
window.glue = glue;
```

Go to the `index.html` file of the **Clients** app, find the `TODO Chapter 9.2` comment and reference the `layoutsPlugin.js` script in the `/plugins` directory:

```html
<script src="/plugins/layoutsPlugin.js"></script>
```

Go to the `layoutsPlugin.js` file located in the `/plugins` folder of the **Clients** app. Find the `TODO Chapter 9.2` comment in `setupLayouts()` and call the `fetchWorkspaceLayoutDefinitions()` function, passing the URL as an argument. Store the fetched Layout definitions in a variable and use the [`import()`](../../reference/core/latest/appmanager/index.html#InMemory-import) method of the [Layouts API](../../reference/core/latest/layouts/index.html) to import the Workspace Layout at runtime.

```javascript
// In setupLayouts().

try {
    const layoutDefinitions = await fetchWorkspaceLayoutDefinitions(url);

    await glue.layouts.import(layoutDefinitions);
} catch (error) {
    console.error(error.message);
};
```

Now the Workspace Layout can be restored by name using the [Workspaces API](../../reference/core/latest/workspaces/index.html).

### 9.3. Initializing Workspaces

To be able to use Workspaces functionalities, initialize the [Workspaces API](../../reference/core/latest/workspaces/index.html) in the **Clients**, **Client Details** and **Stocks** apps. The **Stock Details** app will participate in the Workspace, but won't use any Workspaces functionality.

Find the `TODO: Chapter 9.3` comment in the `index.html` files of the **Clients**, **Stocks** and **Client Details** apps and reference the Workspaces library:

```html
<script src="/lib/workspaces.umd.js"></script>
```

The Workspaces script attaches the `GlueWorkspaces()` factory function to the global `window` object. Go to the `index.js` file of the **Clients** app and add the necessary configuration for initializing the Workspaces library. The **Clients** app is also the [Main app](../../developers/core-concepts/web-platform/overview/index.html) and besides the `GlueWorkspaces()` factory function, its configuration object requires also a `workspaces` property defining where the Workspaces App is located:

```javascript
// In `start()`.

const config = {
    // Pass the `GlueWorkspaces()` factory function.
    glue: { libraries: [GlueWorkspaces] },
    // Specify the location of the Workspaces App.
    workspaces: { src: "http://localhost:9300/" },
    plugins
};

const { glue } = await GlueWebPlatform(config);
window.glue = glue;
```

Next, go to the `index.js` files of the **Client Details** and **Stocks** apps and add a reference to the `GlueWorkspaces()` factory function to the `libraries` array of the configuration object when initializing the Glue42 Web library:

```javascript
// In `start()`.

const config = {
    // Pass the Workspaces factory function.
    libraries: [GlueWorkspaces]
};

const glue = await GlueWeb(config);
window.glue = glue;
```

### 9.4. Opening Workspaces

Next, implement opening a new Workspace when the user clicks on a client in the **Clients** app.

Find the `TODO: Chapter 9.4` comment in the `clientClickedHandler()` function in the **Clients** app, restore by name the Workspace Layout you retrieved earlier and pass the selected client as a starting context. The specified context will be attached as window context to all windows participating in the Workspace:

```javascript
const clientClickedHandler = async (client) => {
    const restoreConfig = {
        context: { client }
    };

    try {
        const workspace = await glue.workspaces.restoreWorkspace("Client Space", restoreConfig);
    } catch (error) {
        console.error(error.message);
    };
};
```

If everything is correct, a new Workspace will now open every time you click on a client.

### 9.5. Starting Context

Handle the starting Workspace context to show the details and the portfolio of the selected client in the **Client Details** and **Stocks** apps. Also, set the Workspace title to the name of the selected client.

Go to the **Client Details** app, find the `TODO: Chapter 9.5` comment in the `start()` function and use the [`onContextUpdated()`](../../reference/core/latest/workspaces/index.html#Workspace-onContextUpdated) method of the current Workspace to subscribe for context updates. Invoke the `setFields()` function passing the value of the `client` property of the updated context and set the title of the Workspace to the name of the selected client:

```javascript
// In `start()`.

const myWorkspace = await glue.workspaces.getMyWorkspace();

if (myWorkspace) {
    myWorkspace.onContextUpdated((context) => {
        if (context.client) {
            setFields(context.client);
            myWorkspace.setTitle(context.client.name);
        };
    });
};
```

Go to the **Stocks** app, find the `TODO: Chapter 9.5` comment, use the [`onContextUpdated()`](../../reference/core/latest/workspaces/index.html#Workspace-onContextUpdated) Workspace method and set up the stocks for the selected client. Store the stocks in the `clientPortfolioStocks` and the client name in the `clientName` global variables, which will be used later:

```javascript
// In `start()`.

const myWorkspace = await glue.workspaces.getMyWorkspace();

if (myWorkspace) {
    myWorkspace.onContextUpdated((context) => {
        if (context.client) {
            const clientPortfolio = context.client.portfolio;
            clientPortfolioStocks = stocks.filter((stock) => clientPortfolio.includes(stock.RIC));
            clientName = context.client.name;

            setupStocks(clientPortfolioStocks);
        };
    });
};
```

Now, when you select a client in the **Clients** app, a new Workspace will open with the **Client Details** and **Stocks** apps showing the relevant client information.

### 9.6. Modifying Workspaces

Next, you have to make the **Stock Details** app appear in the same Workspace as a sibling of the **Stocks** app when the user clicks on a stock. You have to check whether the **Stock Details** app has already been added to the Workspace, and if not - add it and update its context with the selected stock, otherwise - only update its context.

*To achieve this functionality, you will have to manipulate a Workspace and its elements. It is recommended that you familiarize yourself with the Workspaces terminology to fully understand the concepts and steps below. Use the available documentation about [Workspaces Concepts](../../capabilities/windows/workspaces/overview/index.html#workspaces_concepts), [Workspace Box Elements](../../capabilities/windows/workspaces/workspaces-api/index.html#box_elements) and the [Workspaces API](../../reference/core/latest/workspaces/index.html).*

The **Stocks** app is a [`WorkspaceWindow`](../../reference/core/latest/workspaces/index.html#WorkspaceWindow) that is the only child of a [`Group`](../../reference/core/latest/workspaces/index.html#Group) element. If you add the **Stock Details** app as a child to that `Group`, it will be added as a second tab window and the user will have to manually switch between both apps. The **Stock Details** app has to be a sibling of the **Stocks** app, but both apps have to be visible within the same parent element. That's why, you have to add a new `Group` element as a sibling of the existing `Group` that contains the **Stocks** app, and then load the **Stock Details** app in it.

After the **Stocks Details** app has been opened in the Workspace as a [`WorkspaceWindow`](../../reference/core/latest/workspaces/index.html#WorkspaceWindow), you have to pass the selected stock as its context. To do that, get a reference to the underlying [Glue42 Window](../../reference/core/latest/windows/index.html#WebWindow) object of the **Stock Details** window using the [`getGdWindow()`](../../reference/core/latest/workspaces/index.html#WorkspaceWindow-getGdWindow) method of the [`WorkspaceWindow`](../../reference/core/latest/workspaces/index.html#WorkspaceWindow) instance and update its context with the [`updateContext()`](../../reference/core/latest/windows/index.html#WebWindow-updateContext) method.

Go to the `stockClickedHandler()` function of the **Stocks** app, find the `TODO: Chapter 9.6` comment in it, comment out or delete the code for starting the **Stock Details** app with the App Management API and add the following:

```javascript
// In `stockClickedHandler()`.

// Reference to the Glue42 Window object of the Stock Details instance.
let detailsGlue42Window;

const myWorkspace = await glue.workspaces.getMyWorkspace();

// Reference to the `WorkspaceWindow` object of the Stock Details instance.
let detailsWorkspaceWindow = myWorkspace.getWindow(window => window.appName === "Stock Details");

// Check whether the Stock Details has already been opened.
if (detailsWorkspaceWindow) {
    detailsGlue42Window = detailsWorkspaceWindow.getGdWindow();
} else {
    // Reference to the current window.
    const myId = glue.windows.my().id;
    // Reference to the immediate parent element of the Stocks window.
    const myImmediateParent = myWorkspace.getWindow(window => window.id === myId).parent;
    // Add a `Group` element as a sibling of the immediate parent of the Stocks window.
    const group = await myImmediateParent.parent.addGroup();

    // Open the Stock Details window in the newly created `Group` element.
    detailsWorkspaceWindow = await group.addWindow({ appName: "Stock Details" });

    await detailsWorkspaceWindow.forceLoad();

    detailsGlue42Window = detailsWorkspaceWindow.getGdWindow();
};

// Update the window context with the selected stock.
detailsGlue42Window.updateContext({ stock });
```

*Note that [`forceLoad()`](../../reference/core/latest/workspaces/index.html#WorkspaceWindow-forceLoad) is used to make sure that the **Stock Details** app is loaded and a [Glue42 Window](../../reference/core/latest/windows/index.html#WebWindow) instance is available. This is necessary, because [`addWindow()`](../../reference/core/latest/workspaces/index.html#Group-addWindow) adds a new window to the [`Group`](../../reference/core/latest/workspaces/index.html#Group) (meaning that it exists as an element in the Workspace), but it doesn't guarantee that the content has loaded.*

Now, go to the **Stock Details** app, find the `TODO: Chapter 9.6` comment in the `start()` function, check for the selected stock in the window context and subscribe for window context updates. Comment out or delete the existing code for listening for shared context updates (also comment out or delete the code for updating the shared context in the **Clients** app) and modify the existing code for setting the stock details and handling stream subscription updates with the following:

```javascript
// In `start()`.

const myWindow = glue.windows.my();
const context = await myWindow.getContext();
let selectedStock;

if (context && context.stock) {
    selectedStock = context.stock;

    setFields(selectedStock);
};

myWindow.onContextUpdated((context) => {
    if (context.stock) {
        selectedStock = context.stock;

        setFields(selectedStock);
    };
});

const subscription = await glue.interop.subscribe("LivePrices");

const streamDataHandler = (streamData) => {
    if (!selectedStock) {
        return;
    };

    const updatedStocks = streamData.data.stocks;
    const selectedStockPrice = updatedStocks.find(updatedStock => updatedStock.RIC === selectedStock.RIC);

    updateStockPrices(selectedStockPrice.Bid, selectedStockPrice.Ask);
};

subscription.onData(streamDataHandler);
```

Now, when you click on a stock in the **Stocks** app, the **Stock Details** app will open below it in the Workspace showing information about the selected stocks.

## 10. Intents

A new requirement coming from the users is to implement a functionality that exports the portfolio of the selected client. Using the [Intents API](../../reference/core/latest/intents/index.html), you will instrument the **Stocks** app to raise an Intent for exporting the portfolio, and another app will perform the actual action - the **Portfolio Downloader**. The benefit of this is that at a later stage of the project, the app for exporting the portfolio can be replaced, or another app for handling the exported portfolio in a different way can also register the same Intent. In any of these cases, code changes in the **Stocks** app won't be necessary.

*See also the [Capabilities > Intents](../../capabilities/intents/index.html) documentation.*

### 10.1 Registering an Intent

In order for the **Portfolio Downloader** app to be targeted as an Intent handler, it must be registered as such. Apps can be registered as Intent handlers either by declaring the Intents they can handle in their app definition using the `"intents"` top-level key and supplying a handler function via the [`addIntentListener()`](../../reference/core/latest/intents/index.html#API-addIntentListener) method, or at runtime using only the [`addIntentListener()`](../../reference/core/latest/intents/index.html#API-addIntentListener) method. Using the app definition to register an Intent allows the app to be targeted as an Intent handler even if it isn't currently running. If the app is registered as an Intent handler at runtime, it can act as an Intent handler only during its life span.

The **Portfolio Downloader** app is already registered as an Intent handler in the `applications.json` file located in the `/rest-server/data` directory. The only required property is the `name` of the Intent, but you can optionally specify a display name (e.g., `"Download Portfolio"`, which can later be used in a dynamically generated UI) and a context (predefined data structure, e.g. `"ClientPortfolio"`) with which the app can work:

```json
// In `applications.json`.

{
    "name": "Portfolio Downloader",
    "type": "window",
    "details": {
        "url": "http://localhost:9400/"
    },
    // Configuration for handling Intents.
    "intents": [
        {
            "name": "ExportPortfolio",
            "displayName": "Download Portfolio",
            "contexts": [
                "ClientPortfolio"
            ]
        }
    ]
}
```

Go to the `index.js` file of the **Portfolio Downloader** app and find the `TODO: Chapter 10.1` comment. Pass the name of the Intent and the already implemented `intentHandler()` function to the [`addIntentListener()`](../../reference/core/latest/intents/index.html#API-addIntentListener) method, so that it will be called whenever the **Portfolio Downloader** app is targeted as an Intent handler by the user:

```javascript
// In `start()`.

glue.intents.addIntentListener("ExportPortfolio", intentHandler);
```

### 10.2 Raising an Intent

The **Stocks** app must raise an Intent request when the user clicks a button for exporting the portfolio of the selected client.

Go to the `index.html` file of the **Stocks** app, find the `TODO Chapter 10.2` comment and uncomment the "Export Portfolio" button.

Go to the `index.js` file of the **Stocks** app and find the `TODO: Chapter 10.2` comment in the `exportPortfolioButtonHandler()` function. Perform a check whether an Intent with the name `"ExportPortfolio"` exists. If so, create an [Intent request object](../../reference/core/latest/intents/index.html#IntentRequest-target) holding the name of the Intent and specifying targeting behavior and context for it. Use the [`raise()`](../../reference/core/latest/intents/index.html#API-raise) method to raise an Intent and pass the Intent request object to it:

```javascript
// In `exportPortfolioButtonHandler()`.
try {
    const intents = await glue.intents.find("ExportPortfolio");

    if (!intents) {
        return;
    };

    const intentRequest = {
        intent: "ExportPortfolio",
        context: {
            type: "ClientPortfolio",
            data: { portfolio, clientName }
        }
    };

    await glue.intents.raise(intentRequest);

} catch (error) {
    console.error(error.message);
};
```

Find the `TODO: Chapter 10.2` comment in the `start()` function and uncomment the click event handler for the "Export Portfolio" button.

Now, clicking on the "Export Portfolio" button will start the **Portfolio Downloader** app which will start downloading the portfolio of the currently selected client in JSON format.

## 11. Notifications

A new requirement from the users is to display a notification whenever a new Workspace has been opened. The notification must contain information for which client is the opened Workspace. Clicking on the notification must focus the Workspaces App and the Workspace for the respective client. You will use the [Notifications API](../../reference/core/latest/notifications/index.html) to raise a notification when the user clicks on a client to open a Workspace. To the notification `onclick` property, you will assign a handler for focusing the Workspaces App and the Workspace for the respective client. The handler will be invoked when the user clicks on the notification.

*Note that you must allow the Main app to send notifications from the browser and also allow receiving notifications from your OS settings, otherwise you won't be able to see the raised notifications.*

*Note that the notifications that will be raised won't contain action buttons. Notifications with action buttons require [configuring a service worker](../../capabilities/notifications/setup/index.html#configuration), which is beyond the scope of this tutorial.*

*See also the [Capabilities > Notifications](../../capabilities/notifications/setup/index.html) documentation.*

### 11.1 Raising a Notification

Go to **Clients** app and find the `TODO: Chapter 11.1` comment in the `raiseNotificationOnWorkspaceOpen()` function. Define an object holding a title and body for the notification. Use the [`raise()`](../../reference/core/latest/notifications/index.html#API-raise) method to raise a notification and pass the object with options to it:

```javascript
// In `raiseNotificationOnWorkspaceOpen()`.

const options = {
    title: "New Workspace",
    body: `A new Workspace for ${clientName} was opened!`,
};

const notification = await glue.notifications.raise(options);
```

Next, go to the `clientClickedHandler()` function and modify the existing code to call the `raiseNotificationOnWorkspaceOpen()` function and pass to it the client name and the previously obtained [`Workspace`](../../reference/core/latest/workspaces/index.html#Workspace) object:

```javascript
// In `clientClickedHandler()`.

try {
    const workspace = await glue.workspaces.restoreWorkspace("Client Space", restoreConfig);

    await raiseNotificationOnWorkspaceOpen(client.name, workspace);
} catch (error) {
    console.error(error.message);
};
```

Now, a notification will be raised whenever a new Workspace has been opened.

### 11.2 Notification Handler

Go to the `raiseNotificationOnWorkspaceOpen()` function and use the `onclick` property of the previously obtained [`Notification`](../../reference/core/latest/notifications/index.html#Notification) object to assign a handler for focusing the Workspaces App and the Workspace for the respective client:

```javascript
// In `raiseNotificationOnWorkspaceOpen()`.

notification.onclick = () => {
    // This will focus the Workspaces App.
    workspace.frame.focus().catch(console.error);
    // This will focus the Workspace for the respective client.
    workspace.focus().catch(console.error);
};
```

Now, when the user clicks on a notification, the Workspaces App and the Workspace for the respective client will be focused.

## Congratulations!

You have successfully completed the [**Glue42 Core**](https://glue42.com/core/) JavaScript tutorial! If you are a React or an Angular developer, try also the [React](../react/index.html) and [Angular](../angular/index.html) tutorials for [**Glue42 Core**](https://glue42.com/core/).