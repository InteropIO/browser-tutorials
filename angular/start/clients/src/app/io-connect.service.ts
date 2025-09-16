import { Injectable } from '@angular/core';

@Injectable()
export class IOConnectService {
  private getNextCounter(): number {
    const counter = 1 + Number(sessionStorage.getItem('counter'));

    sessionStorage.setItem('counter', counter.toString());

    return counter;
  }
}
