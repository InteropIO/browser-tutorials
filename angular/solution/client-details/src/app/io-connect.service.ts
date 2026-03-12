import { Injectable, NgZone } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { IOConnectStore } from "@interopio/ng";

import { Client, IOConnectStatus } from "./types";

@Injectable()
export class IOConnectService {
    private readonly selectedClientSource = new Subject<Client>();

    constructor(
        private readonly ioConnectStore: IOConnectStore,
        private readonly _zone: NgZone
    ) {
        (window as any).io = this.ioConnectStore.getIOConnect();
    }

    public get connectionStatus(): IOConnectStatus {
        return this.ioConnectStore.getInitError() ? "unavailable" : "available";
    }

    public onClientSelected(): Observable<Client> {
        return this.selectedClientSource.asObservable();
    }

    public async subscribeToWorkspaceContextUpdate(): Promise<void> {
        const myWorkspace = await this.ioConnectStore
            .getIOConnect()
            .workspaces?.getMyWorkspace();

        if (!myWorkspace) {
            return;
        }

        myWorkspace.onContextUpdated((newContext: Client) => {
            this._zone.run(() => this.selectedClientSource.next(newContext));

            myWorkspace.setTitle(newContext.name);
        });
    }
}
