import { Injectable, NgZone } from "@angular/core";
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { IOConnectStore } from "@interopio/ng";
import { IOConnectBrowser } from "@interopio/browser";
import { IOConnectWorkspaces } from "@interopio/workspaces-api";

import { Client, IOConnectStatus, Stock, StockPriceUpdate } from "./types";
import { DataService } from "./data.service";

@Injectable()
export class IOConnectService {
    private readonly selectedClientSource = new Subject<Client>();
    private selectedStockSource!: BehaviorSubject<Stock>;
    private readonly priceUpdateSource = new Subject<{
        Ask: number;
        Bid: number;
    }>();

    constructor(
        private readonly ioConnectStore: IOConnectStore,
        private readonly _zone: NgZone,
        private readonly dataService: DataService
    ) {
        // Setting the io.Connect API to the window object makes it easier to launch the app, open the console and experiment.
        (window as any).io = this.ioConnectStore.getIOConnect();
    }

    public get connectionStatus(): IOConnectStatus {
        return this.ioConnectStore.getInitError() ? "unavailable" : "available";
    }

    public onClientSelected(): Observable<Client> {
        return this.selectedClientSource.asObservable();
    }

    public onPriceUpdate(): Observable<{ Ask: number; Bid: number }> {
        return this.priceUpdateSource.asObservable();
    }

    public onStockSelected(): Observable<Stock> {
        return this.selectedStockSource.asObservable();
    }

    public async getMyWindowContext(): Promise<Stock> {
        // Getting the current window
        const myWindow = this.ioConnectStore.getIOConnect().windows.my();

        // Returning the stock from the context
        return myWindow?.getContext();
    }

    public async openStockDetails(stock: Stock): Promise<void> {
        const windowName = `${stock.BPOD} Details`;
        const URL = "http://localhost:4100/details/";

        // Optional object with settings for the new window.
        const windowSettings: IOConnectBrowser.Windows.Settings = {
            width: 600,
            height: 600,
            left: 900,
            // Pass the selected stock as a context for the new window.
            context: stock
        };

        // Check whether the clicked stock has already been opened in a new window.
        const stockWindowExists = this.ioConnectStore
            .getIOConnect()
            .windows.list()
            .find((w) => w.name === windowName);

        if (stockWindowExists) {
            return;
        }

        // Open a new window by providing a name and URL. The name must be unique.
        await this.ioConnectStore
            .getIOConnect()
            .windows.open(windowName, URL, windowSettings);
    }

    public async registerClientSelect(): Promise<void> {
        const methodName = "SelectClient";

        const handler = (args: { client: Client }): void => {
            this._zone.run(() => this.selectedClientSource.next(args.client));
        };

        // Registering an Interop method by providing a name and callback that will be called when the method is invoked.
        await this.ioConnectStore
            .getIOConnect()
            .interop.register(methodName, handler);
    }

    public async createPriceStream(): Promise<void> {
        const streamName = "LivePrices";

        // Creating an Interop stream.
        const priceStream = await this.ioConnectStore
            .getIOConnect()
            .interop.createStream(streamName);

        // Pushing data to the stream.
        this.dataService
            .onStockPrices()
            .subscribe((priceUpdate) => priceStream.push(priceUpdate));
    }

    public async subscribeToLivePrices(): Promise<IOConnectBrowser.Interop.Subscription> {
        const methodName = "LivePrices";

        // Interop streams are special Interop methods that have a property `supportsStreaming: true`.
        // You can filter Interop methods by name and that property to find the stream you are interested in.
        // If the method is not yet registered, await for it using `waitFormMethodAdded` which returns the expected method
        const streamMethod =
            this.ioConnectStore
                .getIOConnect()
                .interop.methods()
                .find(
                    (method) =>
                        method.name === methodName && method.supportsStreaming
                ) ?? (await this.waitForMethodAdded(methodName, true));

        // Creating a stream subscription.
        const subscription = await this.ioConnectStore
            .getIOConnect()
            .interop.subscribe(streamMethod);

        // Use the `onData()` method of the `subscription` object to define
        // a handler for the received stream data.
        subscription.onData((streamData) => {
            const newPrices: StockPriceUpdate[] = streamData.data.stocks;

            // Only process if we have a current stock
            const currentStock = this.selectedStockSource.value;

            if (!currentStock) {
                return;
            }

            // Extract only the stock you are interested in.
            const selectedStockPrice = newPrices.find(
                (prices) => prices.RIC === currentStock.RIC
            );

            if (!selectedStockPrice) {
                return;
            }

            this._zone.run(() =>
                this.priceUpdateSource.next({
                    Ask: Number(selectedStockPrice.Ask),
                    Bid: Number(selectedStockPrice.Bid)
                })
            );
        });

        return subscription;
    }

    public async subscribeToSharedContext(): Promise<void> {
        // Subscribing for updates to a shared context by specifying context name and providing a handler for the updates.
        await this.ioConnectStore
            .getIOConnect()
            .contexts.subscribe("SelectedClient", (client) => {
                this._zone.run(() => this.selectedClientSource.next(client));
            });
    }

    public subscribeToChannelContext(): void {
        // Subscribing for updates to the current Channel and providing a handler for the updates.
        this.ioConnectStore.getIOConnect().channels.subscribe((client) => {
            this._zone.run(() => this.selectedClientSource.next(client));
        });
    }

    public async startStockDetails(stock: Stock): Promise<void> {
        const detailsApplication = this.ioConnectStore
            .getIOConnect()
            .appManager.application("Stock Details");

        if (!detailsApplication) {
            return;
        }

        // Check whether an instance with the selected stock is already running.
        const contexts = await Promise.all(
            // Use the `instances` property to get all running app instances.
            detailsApplication.instances.map((instance) =>
                instance.getContext()
            )
        );

        const isRunning = contexts.find(
            (context: any) => context?.RIC === stock.RIC
        );

        if (isRunning) {
            return;
        }

        const currentChannel = await this.ioConnectStore
            .getIOConnect()
            .channels.getMy();

        const startOptions: IOConnectBrowser.AppManager.ApplicationStartOptions =
            {
                width: 600,
                height: 600,
                left: 900,
                top: 0,
                channelId: currentChannel?.name
            };

        await detailsApplication.start(stock, startOptions);
    }

    public async getMyAppInstanceContext(): Promise<Stock> {
        // Getting my app instance
        const myInstance =
            this.ioConnectStore.getIOConnect().appManager.myInstance;

        // Getting the context
        return myInstance.getContext() as Promise<Stock>;
    }

    public async setClientFromWorkspace(): Promise<void> {
        const myWorkspace = await this.ioConnectStore
            .getIOConnect()
            .workspaces?.getMyWorkspace();

        if (!myWorkspace) {
            return;
        }

        myWorkspace.onContextUpdated((newContext: Client) => {
            this._zone.run(() => this.selectedClientSource.next(newContext));
        });
    }

    public async openStockDetailsInWorkspace(stock: Stock): Promise<void> {
        const myWorkspace = await this.ioConnectStore
            .getIOConnect()
            .workspaces?.getMyWorkspace();

        if (!myWorkspace) {
            return;
        }

        // Search for `WorkspaceWindow` object of the Stock Details instance.
        let detailsWorkspaceWindow = myWorkspace.getWindow(
            (window) => window.appName === "Stock Details"
        );

        // There's an already wsp window of the Stock Details app
        if (detailsWorkspaceWindow) {
            // Update the context of the Stock Details window
            return detailsWorkspaceWindow.getGdWindow().updateContext(stock);
        }

        // Find id of the current window
        const myId = this.ioConnectStore.getIOConnect().windows.my()?.id;

        // Reference to the immediate parent element of the Stocks window.
        const myImmediateParent = myWorkspace.getWindow(
            (window) => window.id === myId
        ).parent;

        if (!myImmediateParent) {
            return;
        }

        // Add a `Group` element as a sibling of the immediate parent of the Stocks window.
        const group = await (
            myImmediateParent as IOConnectWorkspaces.WorkspaceBox
        ).parent.addGroup();

        // Open the Stock Details window in the newly created `Group` element.
        detailsWorkspaceWindow = await group.addWindow({
            appName: "Stock Details"
        });

        await detailsWorkspaceWindow.forceLoad();

        await detailsWorkspaceWindow.getGdWindow().updateContext(stock);
    }

    public setSelectedStock(stock: Stock): void {
        if (this.selectedStockSource) {
            return this.selectedStockSource.next(stock);
        }

        this.selectedStockSource = new BehaviorSubject<Stock>(stock);
    }

    public subscribeForStockContextUpdate(): void {
        const myWindow = this.ioConnectStore.getIOConnect().windows.my();

        myWindow?.onContextUpdated((context: Stock) => {
            this._zone.run(() => this.setSelectedStock(context));
        });
    }

    public async raiseExportPortfolioIntentRequest(): Promise<void> {
        const intentName = "ExportPortfolio";

        const intents = await this.ioConnectStore
            .getIOConnect()
            .intents.find(intentName);

        if (!intents.length) {
            // There's no such intent available => do nothing
            return;
        }

        // Get the current client from the workspace window context
        const client = await this.getMyWorkspaceContext();

        const intentRequest: IOConnectBrowser.Intents.IntentRequest = {
            intent: intentName,
            context: {
                type: "ClientPortfolio",
                data: client
            }
        };

        await this.ioConnectStore
            .getIOConnect()
            .intents.raise(intentRequest)
            .catch(console.error);
    }

    private async getMyWorkspaceContext(): Promise<Client> {
        const myWorkspace = await this.ioConnectStore
            .getIOConnect()
            .workspaces?.getMyWorkspace();

        return myWorkspace?.getContext() as Promise<Client>;
    }

    private waitForMethodAdded(
        methodName: string,
        supportsStreaming: boolean = false
    ): Promise<IOConnectBrowser.Interop.MethodDefinition> {
        return new Promise<IOConnectBrowser.Interop.MethodDefinition>(
            (resolve) => {
                const unsubscribe = this.ioConnectStore
                    .getIOConnect()
                    .interop.methodAdded((method) => {
                        // The method we're waiting for has been added
                        if (
                            method.name === methodName &&
                            method.supportsStreaming === supportsStreaming
                        ) {
                            // Unsubscribing from the method added event.
                            unsubscribe();
                            // Resolving the promise.
                            resolve(method);
                        }
                    });
            }
        );
    }
}
