import {
  Component,
  Input,
  ElementRef,
  OnChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3';
import { DataModel } from './../data/data.model';

@Component({
  selector: 'app-bar-chart',
  // Dynamic modifications to the DOM by D3 do not play well with default Angular styling; set ViewEncapsulation.None
  encapsulation: ViewEncapsulation.None,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnChanges {
  @ViewChild('chart', { static: true })
  private chartContainer: ElementRef;

  @Input() data: DataModel[];

  margin = { top: 20, right: 20, bottom: 30, left: 40 };

  constructor() {}

  ngOnChanges(): void {
    if (!this.data) {
      return;
    }
    this.createChart();
  }

  onResize() {
    this.createChart();
  }

  private createChart(): void {
    d3.select('svg').remove();

    // Use our HTML container element to determine the width and height of our D3 generated chart
    const element = this.chartContainer.nativeElement;

    // Use the data supplied via our Input property
    const data = this.data;

    // Draw our SVG chart using the container element's width and height
    const svg = d3
      .select(element)
      // Append a new SVG element to our container using the same width and height
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // Calculate our content width based on our container element and left and right margins
    const contentWidth =
      element.offsetWidth - this.margin.left - this.margin.right;

    // Calculate our content height based on our container element and top and bottom margins
    const contentHeight =
      element.offsetHeight - this.margin.top - this.margin.bottom;

    const x = d3
      /**
       * When creating bar charts scaleBand helps to determine the geometry of the bars, taking into account padding between each bar.
       * The domain is specified as an array of values (one value for each band) and the range as the minimum and maximum extents of
       * the bands (e.g. the total width of the bar chart).
       *
       * In effect scaleBand will split the range into n bands (where n is the number of values in the domain array) and compute
       * the positions and widths of the bands taking into account any specified padding.
       *
       * Source: https://www.d3indepth.com/scales/
       */
      .scaleBand()
      /**
       * v4’s .rangeRound() and .padding() replaced v3’s rangeRoundBands()
       * https://medium.com/@nick3499/d3-scaleband-rangeround-padding-ordinal-scale-with-range-bands-including-padding-f4af1e3c96ab
       */
      .rangeRound([0, contentWidth])
      .padding(0.1)
      // Domain refers to the complete set of values - we want to display each letter on the x axis
      .domain(data.map(d => d.letter));

    const y = d3
      /**
       * Constructs a new continuous scale with the specified domain and range, the default interpolator and clamping disabled.
       * If either domain or range are not specified, each defaults to [0, 1]. Linear scales are a good default choice for continuous
       * quantitative data because they preserve proportional differences. Each range value y can be expressed as a function of
       * the domain value x: y = mx + b.
       *
       * Source: https://github.com/d3/d3-scale/blob/master/README.md#scaleLinear
       */
      .scaleLinear()
      // Since we do not to represent fractional numbers, we will use rangeRound() to ensure we have whole numbers for our y axis
      .rangeRound([contentHeight, 0])
      // Domain refers to the complete set of values - our y axis will display up to the largest value we have
      .domain([0, d3.max(data, d => d.frequency)]);

    // Think of "g" as the "div" equivalent when creating SVG images
    const g = svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ', ' + this.margin.top + ')'
      );

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      /**
       * Constructs a new bottom-oriented axis generator for the given scale, with empty tick arguments, a
       * tick size of 6 and padding of 3. In this orientation, ticks are drawn below the horizontal domain path.
       *
       * Source: https://github.com/d3/d3-axis#axisBottom
       */
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis--y')
      /**
       * Constructs a new left-oriented axis generator for the given scale, with empty tick arguments, a
       * tick size of 6 and padding of 3. In this orientation, ticks are drawn to the left of the vertical domain path.
       */
      .call(d3.axisLeft(y)
      // We want D3 to intelligently generate 10 ticks for our range if possible; adding a % symbol after the value is displayed
      .ticks(10, '%'));

    // Select all of the bars
    g.selectAll('.bar')
      // Bind our data to this selection
      .data(data)
      // .enter identifies any DOM elements that need to be added
      .enter()
        // Create an SVG rect for any new elements with appropriate values
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.letter))
        .attr('y', d => y(d.frequency))
        .attr('width', x.bandwidth())   // bandwidth() will determine how wide each band of our bar chart should be
        .attr('height', d => contentHeight - y(d.frequency));
  }
}
