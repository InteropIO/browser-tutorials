import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  // private ioConnectSubscription?: IOConnectBrowser.Interop.Subscription;

  constructor(
    private readonly dataService: DataService,
    private readonly ioConnectService: IOConnectService
  ) {}

  public ngOnInit(): void {
    this.stock = this.dataService.selectedStock;
  }
}
