import { Injectable } from "@angular/core";
import { Subject, Observable, BehaviorSubject } from "rxjs";

import { Client, Stock } from "./types";

@Injectable()
export class IOConnectService {
    private readonly selectedClientSource = new Subject<Client>();
    private selectedStockSource!: BehaviorSubject<Stock>;
    private readonly priceUpdateSource = new Subject<{
        Ask: number;
        Bid: number;
    }>();

    public onClientSelected(): Observable<Client> {
        return this.selectedClientSource.asObservable();
    }

    public onStockSelected(): Observable<Stock> {
        return this.selectedStockSource.asObservable();
    }

    public onPriceUpdate(): Observable<{ Ask: number; Bid: number }> {
        return this.priceUpdateSource.asObservable();
    }
}
