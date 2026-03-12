import { Routes } from "@angular/router";
import { Stocks } from "./stocks/stocks";
import { StockDetails } from "./stock-details/stock-details";

export const routes: Routes = [
    { path: "details", component: StockDetails },
    { path: "", component: Stocks }
];
