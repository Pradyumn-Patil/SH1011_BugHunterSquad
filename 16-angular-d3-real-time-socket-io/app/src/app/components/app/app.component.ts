import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { MarketStatusService } from '../../services/market-status.service';
import { MarketPrice } from '../../types/market-price';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  marketStatus: MarketPrice[];
  marketStatusToPlot: MarketPrice[];

  set MarketStatus(status: MarketPrice[]) {
    this.marketStatus = status;
    this.marketStatusToPlot = this.marketStatus.slice(0, 20);
  }

  constructor(private marketStatusService: MarketStatusService) {
    this.marketStatusService.getInitialMarketStatus().subscribe(prices => {
      this.MarketStatus = prices;

      const marketUpdateObservable = this.marketStatusService.getUpdates();
      marketUpdateObservable.subscribe((latestStatus: MarketPrice) => {
        // Create a new MarketStatus array instead of updating the existing value so that the
        // consuming app-market-chart component is aware data has changed
        this.MarketStatus = [latestStatus].concat(this.marketStatus);
      });
    });
  }
}
