import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Client, IOConnectStatus } from './types';
import { IOConnectService } from './io-connect.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public client!: Client;
  public readonly ioConnectStatus = signal<IOConnectStatus>('disconnected');

  constructor(private readonly ioConnectService: IOConnectService) {}
  
  public async ngOnInit(): Promise<void> {
  }
}
