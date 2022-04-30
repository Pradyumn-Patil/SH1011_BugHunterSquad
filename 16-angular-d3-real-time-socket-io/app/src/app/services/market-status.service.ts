import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, from } from 'rxjs';
import * as socketio from 'socket.io-client';

import { MarketPrice } from '../types/market-price';

@Injectable({
  providedIn: 'root'
})
export class MarketStatusService {
  private baseUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) { }

  getInitialMarketStatus() {
    return this.httpClient.get<MarketPrice[]>(`${this.baseUrl}/api/market`);
  }

  getUpdates() {
    // Create a manager for the Socket.IO endpoint at our specified URL
    const socket = socketio(this.baseUrl);
    // Create a RxJS Subject
    const marketSubscription = new Subject<MarketPrice>();
    // Create an Observable so consumers can listen to the updates
    const marketSubscriptionObservable = from(marketSubscription);

    // Socket.IO events
    socket.on('market', (marketStatus: MarketPrice) => {
      // Invoked whenever the Socket.IO endpoint publishes something new
      marketSubscription.next(marketStatus);
    });

    return marketSubscriptionObservable;
  }
}
