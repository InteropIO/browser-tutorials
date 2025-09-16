import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Client, IOConnectStatus, Stock } from '../types';
import { DataService } from '../data.service';
import { IOConnectService } from '../io-connect.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stocks',
  imports: [CommonModule],
  templateUrl: './stocks.html',
  styleUrl: './stocks.css',
})
export class Stocks {
  private allStocks: Stock[] = [];
  public stocks: Stock[] = [];
  public ioConnectStatus = signal<IOConnectStatus>('disconnected');

  constructor(
    private readonly data: DataService,
    private readonly router: Router,
    private readonly ioConnectService: IOConnectService
  ) {}

  public async ngOnInit(): Promise<void> {
    this.allStocks = await this.data.getStocks();
    this.stocks = this.allStocks;

    this.ioConnectStatus.set(this.ioConnectService.connectionStatus);

    if (this.ioConnectStatus() === 'available') {
      // // Registering the Interop method.
      // this.ioConnectService.registerClientSelect().catch(console.error);

      // // Subscribe to Shared Context Updates
      // this.ioConnectService.subscribeToSharedContext().catch(console.error);

      // // Subscribe to Channel Context Updates
      // this.ioConnectService.subscribeToChannelContext();
  
      // Creating the Interop stream.
      this.ioConnectService.createPriceStream().catch(console.error);

      // Subscribe for workspace context update
      this.ioConnectService.setClientFromWorkspace().catch(console.log);
    }

    // Subscribing for notifications when the selected client changes.
    this.ioConnectService.onClientSelected().subscribe((client) => {
      this.stocks = this.allStocks.filter(stock => client.portfolio.includes(stock.RIC));
    });

    this.data.onStockPrices().subscribe((update) => {
      this.stocks.forEach((stock) => {
        const matchingStock = update.stocks.find((stockUpdate) => stockUpdate.RIC === stock.RIC);
        stock.Ask = matchingStock!.Ask;
        stock.Bid = matchingStock!.Bid;
      });
    });
  }

  public handleStockClick(stock: Stock): void {
    const isConnected = this.ioConnectStatus() === "available";

    if (isConnected) {
      // this.ioConnectService.openStockDetails(stock).catch(console.error);
      // this.ioConnectService.startStockDetails(stock).catch(console.error);
      this.ioConnectService.openStockDetailsInWorkspace(stock);
      return;
    }

    this.data.selectedStock = stock;
    this.router.navigate(['/details']);
  }

  public handleExportPortfolioClick(): void {
    this.ioConnectService.raiseExportPortfolioIntentRequest().catch(console.error);
  }
}
