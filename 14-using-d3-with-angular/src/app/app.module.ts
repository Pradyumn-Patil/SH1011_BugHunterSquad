import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
// import { TimelineComponent } from './timeline/timeline.component'
// import { ScatterComponent } from './scatter/scatter.component'
// import { HistogramComponent } from './histogram/histogram.component'
// import { ChartComponent } from './chart/chart.component'
// import { AxisComponent } from './chart/axis/axis.component'
// import { LineComponent } from './chart/line/line.component'
// import { CirclesComponent } from './chart/circles/circles.component'
// import { BarsComponent } from './chart/bars/bars.component'
// import { GradientComponent } from './chart/gradient/gradient.component'
import { TimelineComponent } from "./completed/timeline/timeline.component";
import { ScatterComponent } from "./completed/scatter/scatter.component";
import { HistogramComponent } from "./completed/histogram/histogram.component";
import { ChartComponent } from "./completed/chart/chart.component";
import { AxisComponent } from "./completed/chart/axis/axis.component";
import { LineComponent } from "./completed/chart/line/line.component";
import { CirclesComponent } from "./completed/chart/circles/circles.component";
import { BarsComponent } from "./completed/chart/bars/bars.component";
import { GradientComponent } from "./completed/chart/gradient/gradient.component";

@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    ScatterComponent,
    HistogramComponent,
    ChartComponent,
    AxisComponent,
    LineComponent,
    CirclesComponent,
    BarsComponent,
    GradientComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
