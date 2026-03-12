import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";

import { IOConnectStatus } from "./types";

@Component({
    selector: "app-root",
    imports: [CommonModule],
    templateUrl: "./app.html",
    styleUrl: "./app.css"
})
export class App {
    public clientName?: string;
    public ioConnectStatus = signal<IOConnectStatus>("disconnected");

    public async ngOnInit(): Promise<void> {}
}
