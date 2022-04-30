import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
import * as d3 from 'd3';

import { MarketPrice } from '../../types/market-price';

@Component({
  selector: 'app-market-chart',
  templateUrl: './market-chart.component.html',
  styleUrls: ['./market-chart.component.css'],
  // Add the onPush change detection strategy so that our chart is only re-rendered when the input changes
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarketChartComponent implements OnChanges {
  @Input() marketStatus: MarketPrice[];

  // Notice that we have a local reference to #chart in our HTML file
  @ViewChild('chart', { static: true }) chartElement: ElementRef;

  private svgElement: HTMLElement;
  private chartProps: any;

  parseDate = d3.timeParse('%d-%m-%Y');

  constructor() {}

  ngOnChanges() {
    if (this.marketStatus && this.chartProps) {
      this.updateChart();
    } else if (this.marketStatus) {
      this.buildChart();
    }
  }

  formatDate() {
    this.marketStatus.forEach(ms => {
      // Remember - our MarketPrice class defines date as either a string or a Date
      if (typeof ms.date === 'string') {
        ms.date = this.parseDate(ms.date);
      }
    });
  }

  buildChart() {
    this.chartProps = {};
    this.formatDate();

    // Set the dimensions of the canvas / graph
    const margin = { top: 30, right: 20, bottom: 30, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 270 - margin.top - margin.bottom;

    // Set the ranges
    this.chartProps.x = d3.scaleTime().range([0, width]);
    this.chartProps.y = d3.scaleLinear().range([height, 0]);

    // Define the axes
    const xAxis = d3.axisBottom(this.chartProps.x);
    const yAxis = d3.axisLeft(this.chartProps.y).ticks(7);

    // Define the close market price line
    const valueLine = d3
      .line<MarketPrice>()
      .x(d => {
        if (d.date instanceof Date) {
          return this.chartProps.x(d.date.getTime());
        }
      })
      .y(d => {
        return this.chartProps.y(d.close);
      });

    // Define the open market price line
    const valueLine2 = d3
      .line<MarketPrice>()
      .x(d => {
        if (d.date instanceof Date) {
          return this.chartProps.x(d.date.getTime());
        }
      })
      .y(d => {
        return this.chartProps.y(d.open);
      });

    // Define our SVG image
    const svg = d3
      // Select our div
      .select(this.chartElement.nativeElement)
      // Create an SVG image
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      // Append g (the div of the SVG world)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Scale the range of our data
    this.chartProps.x.domain(
      d3.extent(this.marketStatus, d => {
        if (d.date instanceof Date) {
          return (d.date as Date).getTime();
        }
      })
    );
    // Note that we are starting at 0 for the y domain and then using the largest value to represent (the largest open or close value)
    this.chartProps.y.domain([
      0,
      d3.max(this.marketStatus, d => {
        return Math.max(d.close, d.open);
      })
    ]);

    // Add the valueLine2 path
    svg
      .append('path')
      .attr('class', 'line line2')
      .style('stroke', 'green')
      .style('fill', 'none')
      .attr('d', valueLine2(this.marketStatus));

    // Add the valueLine path
    svg
      .append('path')
      .attr('class', 'line line1')
      .style('stroke', 'black')
      .style('fill', 'none')
      .attr('d', valueLine(this.marketStatus));

    // Add the X axis
    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    // Add the Y axis
    svg
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    // Set the required objects in chartProps so they can be used to update the chart
    this.chartProps.svg = svg;
    this.chartProps.valueLine = valueLine;
    this.chartProps.valueLine2 = valueLine2;
    this.chartProps.xAxis = xAxis;
    this.chartProps.yAxis = yAxis;
  }

  updateChart() {
    this.formatDate();

    // Scale the range of the data again
    this.chartProps.x.domain(
      d3.extent(this.marketStatus, d => {
        if (d.date instanceof Date) {
          return d.date.getTime();
        }
      })
    );
    this.chartProps.y.domain([
      0,
      d3.max(this.marketStatus, d => {
        return Math.max(d.close, d.open);
      })
    ]);

    // Select the section we want to apply our changes to
    this.chartProps.svg.transition();

    // Make the changes to the line chart
    // Draw updated valueLine
    this.chartProps.svg
      .select('.line.line1')
      .attr('d', this.chartProps.valueLine(this.marketStatus));
    // Draw updated valueLine2
    this.chartProps.svg
      .select('.line.line2')
      .attr('d', this.chartProps.valueLine2(this.marketStatus));
    // Draw updated x axis
    this.chartProps.svg.select('.x.axis').call(this.chartProps.xAxis);
    // Draw updated y axis
    this.chartProps.svg.select('.y.axis').call(this.chartProps.yAxis);
  }
}
