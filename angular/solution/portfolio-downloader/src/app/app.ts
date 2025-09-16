import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

import { IOConnectStatus } from './types';
import { IOConnectService } from './io-connect.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public clientName?: string;
  public ioConnectStatus = signal<IOConnectStatus>('disconnected');

  constructor(private readonly ioConnectService: IOConnectService) {}

  public async ngOnInit(): Promise<void> {
    this.ioConnectStatus.set(this.ioConnectService.connectionStatus);

    if (this.ioConnectStatus() === 'available') {
      await this.ioConnectService.setupIntentListener();
    }

    this.ioConnectService.selectedClient.subscribe(client => {
      this.clientName = client?.name;
    });
  }
}
