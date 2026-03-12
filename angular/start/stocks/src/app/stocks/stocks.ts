import { Component, signal } from "@angular/core";
import { Router } from "@angular/router";

import { IOConnectStatus, Stock } from "../types";
import { DataService } from "../data.service";
import { IOConnectService } from "../io-connect.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-stocks",
    imports: [CommonModule],
    templateUrl: "./stocks.html",
    styleUrl: "./stocks.css"
})
export class Stocks {
    private allStocks: Stock[] = [];
    public stocks: Stock[] = [];
    public ioConnectStatus = signal<IOConnectStatus>("disconnected");

    constructor(
        private readonly data: DataService,
        private readonly router: Router,
        private readonly ioConnectService: IOConnectService
    ) {}

    public async ngOnInit(): Promise<void> {
        this.allStocks = await this.data.getStocks();
        this.stocks = this.allStocks;

        this.data.onStockPrices().subscribe((update) => {
            this.stocks.forEach((stock) => {
                const matchingStock = update.stocks.find(
                    (stockUpdate) => stockUpdate.RIC === stock.RIC
                );
                stock.Ask = matchingStock!.Ask;
                stock.Bid = matchingStock!.Bid;
            });
        });
    }

    public handleStockClick(stock: Stock): void {
        this.data.selectedStock = stock;
        this.router.navigate(["/details"]);
    }
}
