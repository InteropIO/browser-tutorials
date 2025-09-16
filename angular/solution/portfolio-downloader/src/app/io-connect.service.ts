import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IOConnectStore } from '@interopio/ng';

import { Client, IOConnectStatus } from './types';

@Injectable()
export class IOConnectService {
  private selectedClientSource = new BehaviorSubject<Client | undefined>(undefined);

  constructor(private readonly ioConnectStore: IOConnectStore) {
    (window as any).io = this.ioConnectStore.getIOConnect();
  }

  public get connectionStatus(): IOConnectStatus {
    return this.ioConnectStore.getInitError() ? "unavailable" : "available";
  }

  public get selectedClient(): Observable<Client | undefined> {
    return this.selectedClientSource.asObservable();
  }

  public async setupIntentListener(): Promise<void> {
    const intentName = 'ExportPortfolio';

    const handler = (context: any) => {
      if (context?.type !== 'ClientPortfolio') {
        return;
      }

      const client = context.data as Client;

      // Set the client to the BehaviorSubject
      this.selectedClientSource.next(client);

      this.startPortfolioDownload(client.name, client.portfolio);
    };

    // Register Intent
    await this.ioConnectStore.getIOConnect().intents.register(intentName, handler);
  }

  private startPortfolioDownload(clientName: string, portfolio: string) {
    const dataToWrite = JSON.stringify(
      {
        date: new Date(Date.now()).toLocaleString('en-US'),
        portfolio,
      },
      null,
      4
    );

    const element = document.createElement('a');
    const blob = new Blob([dataToWrite], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    element.href = href;
    element.download = `${clientName ? clientName + "'s " : ''}Portfolio.json`;

    element.click();
    URL.revokeObjectURL(href);
  }
}
