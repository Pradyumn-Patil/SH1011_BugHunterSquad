import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './components/app/app.component';
import { MarketChartComponent } from './components/market-chart/market-chart.component';

@NgModule({
  declarations: [AppComponent, MarketChartComponent],
  imports: [
    BrowserModule,
    HttpClientModule // Needed to consume REST APIs
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
