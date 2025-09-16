import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Client } from './types';

@Injectable()
export class DataService {
  constructor(private readonly http: HttpClient) {}

  public getClients(): Promise<Client[]> {
    return firstValueFrom(this.http.get<Client[]>('http://localhost:8080/api/clients'));
  }
}
