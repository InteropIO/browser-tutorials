import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Client } from './types';

@Injectable()
export class IOConnectService {
  private selectedClientSource = new BehaviorSubject<Client | undefined>(undefined);

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

      this.selectedClientSource.next(client);

      this.startPortfolioDownload(client.name, client.portfolio);
    };

    // Register Intent
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
