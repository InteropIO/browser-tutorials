import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

import { Client } from "./types";


@Injectable()
export class IOConnectService {
    private readonly selectedClientSource = new Subject<Client>();

    public onClientSelected(): Observable<Client> {
        return this.selectedClientSource.asObservable();
    }
}