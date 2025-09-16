import { Injectable } from '@angular/core';
import { IOConnectStore } from '@interopio/ng';
import { IOConnectWorkspaces } from "@interopio/workspaces-api";

import { Client, IOConnectStatus } from './types';

@Injectable()
export class IOConnectService {
  constructor(private readonly ioConnectStore: IOConnectStore) {
    // Setting the io.Connect API to the window object makes it easier to launch the app, open the console and experiment.
    (window as any).io = this.ioConnectStore.getIOConnect();
  }

  public get connectionStatus(): IOConnectStatus {
    return this.ioConnectStore.getInitError() ? "unavailable" : "available";
  }

  public async openStocksWindow(): Promise<void> {
    const name = `Stocks-${this.getNextCounter()}`;

    await this.ioConnectStore.getIOConnect().windows.open(name, "http://localhost:4100");
  }

  public async sendSelectedClientByInterop(client: Client): Promise<void> {
    const methodName = "SelectClient";
    const methodArgs = { client };

    // Finding an Interop method by name.
    const interopMethod = this.ioConnectStore.getIOConnect().interop.methods().find(method => method.name === methodName);

    if (!interopMethod) {
      // Wait for the Interop method to be registered
      await this.waitForMethodAdded(methodName);
    }

    // Invoking the Interop method by name and providing arguments for the invocation.
    await this.ioConnectStore.getIOConnect().interop.invoke(methodName, methodArgs);
  }

  public async sendSelectedClient(client: Client): Promise<void> {
    // Updating a shared context by name with a provided value (any object).
    await this.ioConnectStore.getIOConnect().contexts.update("SelectedClient", client);

    // Get the current Channel
    const currentChannel = await this.ioConnectStore.getIOConnect().channels.getMy();

    // Publish on current Channel
    if (currentChannel) {
        await this.ioConnectStore.getIOConnect().channels.publish(client);
    }
  }

  public async startStocksApp(): Promise<void> {
    const stocksApp = this.ioConnectStore.getIOConnect().appManager.application("Stocks");

    if (!stocksApp) {
      return;
    }

    const currentChannel = await this.ioConnectStore.getIOConnect().channels.getMy();

    await stocksApp.start(undefined, { channelId: currentChannel?.name }).catch(console.error);
  }

  public async restoreWorkspace(client: Client): Promise<void> {
    try {
        const workspace = await this.ioConnectStore.getIOConnect().workspaces?.restoreWorkspace("Client Space", { context: client });

        await this.raiseNotificationOnWorkspaceOpen(client.name, workspace as IOConnectWorkspaces.Workspace);
    } catch (error: any) {
        console.error(JSON.stringify(error));
    }
  }

  private async raiseNotificationOnWorkspaceOpen(clientName: string, workspace: IOConnectWorkspaces.Workspace): Promise<void> {
    const options = {
      title: "New Workspace",
      body: `A new Workspace for ${clientName} was opened!`,
    };

    const notification = await this.ioConnectStore.getIOConnect().notifications.raise(options);

    notification.onclick = () => {
      // This will focus the Workspaces App.
      workspace.frame.focus().catch(console.error);
      // This will focus the Workspace for the respective client.
      workspace.focus().catch(console.error);
    };
  }
  
  private getNextCounter(): number {
    const counter = 1 + Number(sessionStorage.getItem('counter'));

    sessionStorage.setItem('counter', counter.toString());

    return counter;
  }

  private waitForMethodAdded(methodName: string): Promise<void> {
    return new Promise((resolve) => {
        const unsubscribe = this.ioConnectStore.getIOConnect().interop.methodAdded((method) => {
            // The method we're waiting for has been added
            if (method.name === methodName) {
                // Unsubscribing from the method added event.
                unsubscribe();
                // Resolving the promise.
                resolve();
            }
        });
    });
  }
}
