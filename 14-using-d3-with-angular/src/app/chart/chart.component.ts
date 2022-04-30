import { Component, Input } from '@angular/core';
import { DimensionsType } from './../utils/types';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {
  // We want to pass our chart a dimensions object so it can shift our chart bounds
  @Input() dimensions: DimensionsType
}
