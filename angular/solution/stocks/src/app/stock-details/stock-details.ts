import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOConnectBrowser } from "@interopio/browser"

import { IOConnectStatus, Stock } from '../types';
import { DataService } from '../data.service';
import { IOConnectService } from '../io-connect.service';

@Component({
  selector: 'app-stock-details',
  imports: [CommonModule],
  templateUrl: './stock-details.html',
  styleUrl: './stock-details.css',
})
export class StockDetails {
  public stock?: Stock;
  public ioConnectStatus = signal<IOConnectStatus>('disconnected');
  public clientMessage?: string;
  private ioConnectSubscription?: IOConnectBrowser.Interop.Subscription;

  constructor(
    private readonly dataService: DataService,
    private readonly ioConnectService: IOConnectService
  ) {}

  public async ngOnInit(): Promise<void> {
    this.stock = this.dataService.selectedStock;

    this.ioConnectStatus.set(this.ioConnectService.connectionStatus);

    if (this.ioConnectStatus() === 'available') {
      // Retrieve the current stock from window context
      this.stock = await this.ioConnectService.getMyWindowContext();

      // // Retrieve the current stock from app instance context
      // this.stock = await this.ioConnectService.getMyAppInstanceContext();

      this.ioConnectService.setSelectedStock(this.stock);

      this.ioConnectSubscription = await this.ioConnectService.subscribeToLivePrices();

      // Subscribe to selected client updates
      // this.ioConnectService.subscribeToSharedContext().catch(console.error);
      
      // Subscribe for stock context updates
      this.ioConnectService.subscribeForStockContextUpdate();
    }

    this.ioConnectService.onStockSelected().subscribe((stock) => {
      this.stock = stock;
    });

    // this.ioConnectService.onClientSelected().subscribe((client) => {
    //   this.clientMessage = client.portfolio.includes(this.stock!.RIC)
    //       ? `${client.name} has this stock in their portfolio`
    //       : `${client.name} does NOT have this stock in their portfolio`;
    // });

    this.ioConnectService.onPriceUpdate().subscribe((newPrices) => {
      this.stock!.Ask = newPrices.Ask;
      this.stock!.Bid = newPrices.Bid;
    });
  }

  public ngOnDestroy(): void {
    // Closing the stream subscription.
    this.ioConnectSubscription?.close();
  }
}
