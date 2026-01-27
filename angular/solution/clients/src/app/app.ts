import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

import { Client, IOConnectStatus } from "./types";
import { DataService } from "./data.service";
import { IOConnectService } from "./io-connect.service";

@Component({
    selector: "app-root",
    imports: [CommonModule],
    templateUrl: "./app.html",
    styleUrl: "./app.css"
})
export class App {
    public clients: Client[] = [];
    public ioConnectStatus = signal<IOConnectStatus>("disconnected");

    constructor(
        private readonly data: DataService,
        private readonly ioConnectService: IOConnectService
    ) {}

    public async ngOnInit(): Promise<void> {
        this.clients = await this.data.getClients();

        this.ioConnectStatus.set(this.ioConnectService.connectionStatus);
    }

    public async handleClientClick(client: Client): Promise<void> {
        // await this.ioConnectService.openStocksWindow();
        // await this.ioConnectService.startStocksApp();
        // await this.ioConnectService.sendSelectedClient(client);

        await this.ioConnectService.restoreWorkspace(client);
    }
}
