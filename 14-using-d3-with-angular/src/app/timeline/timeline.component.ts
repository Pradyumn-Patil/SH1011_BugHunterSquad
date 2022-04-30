import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterContentInit,
  HostListener,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import * as d3 from "d3";
import { getUniqueId } from "../chart/utils";
import { DimensionsType, ScaleType, AccessorType } from "../utils/types";

@Component({
  selector: "app-timeline",
  templateUrl: "./timeline.component.html",
  styleUrls: ["./timeline.component.css"],
})
export class TimelineComponent implements AfterContentInit, OnChanges {
  // Note that our properties are flexible enough so we could use any dataset with our timeline component
  @Input() data: object[];
  @Input() label: string;
  @Input() xAccessor: AccessorType;
  @Input() yAccessor: AccessorType;

  public dimensions: DimensionsType;

  // Create scales to convert from the data domain to the pixel domain
  public xScale: ScaleType;
  public yScale: ScaleType;
  public xAccessorScaled: AccessorType;
  public yAccessorScaled: AccessorType;
  public y0AccessorScaled: AccessorType;

  // Format our date object into a prettier, human-readable value (Oct 1, Nov 1)
  public formatDate: (date: object) => string = d3.timeFormat("%-b %-d");

  // Use ViewChild to hook onto an element in our template
  // NOTE: Starting with Angular 8, we need to add the second parameter to ViewChild. This will ensure our container is ready by the time we want to use it.
  @ViewChild("container", { static: true }) container: ElementRef;

  constructor() {
    this.dimensions = {
      marginTop: 40,
      marginRight: 30,
      marginBottom: 75,
      marginLeft: 75,
      height: 300,
      width: 600,
    };

    // Calculate the bounded height and width of our timeline
    this.dimensions = {
      ...this.dimensions,
      boundedHeight: Math.max(
        this.dimensions.height -
          this.dimensions.marginTop -
          this.dimensions.marginBottom,
        0
      ),
      boundedWidth: Math.max(
        this.dimensions.width -
          this.dimensions.marginLeft -
          this.dimensions.marginRight,
        0
      ),
    };
  }

  // Execute this after the component is first rendered
  ngAfterContentInit() {
    this.updateDimensions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update our scales whenever data changes
    this.updateScales();
  }

  // Use HostListener to update our dimensions every time the window is resized
  @HostListener("window:resize") windowResize() {
    this.updateDimensions();
  }

  // Update dimensions based on the width of our container div
  updateDimensions() {
    const width = this.container.nativeElement.offsetWidth;
    this.dimensions.width = width;
    this.dimensions.boundedWidth = Math.max(
      this.dimensions.width -
        this.dimensions.marginLeft -
        this.dimensions.marginRight,
      0
    );

    // Update our scales whenever the dimensions change
    this.updateScales();
  }

  // Update scales and scaled accessor functions that we can pass to chart components
  updateScales() {
    // Scale for x-axis
    this.xScale = d3
      .scaleTime()
      .domain(d3.extent(this.data, this.xAccessor))
      .range([0, this.dimensions.boundedWidth]);

    // Scale for y-axis
    this.yScale = d3
      .scaleLinear()
      .domain(d3.extent(this.data, this.yAccessor))
      .range([this.dimensions.boundedHeight, 0])
      .nice();

    // Create scaled accessor functions so that our chart components do not need to be aware of our scales
    this.xAccessorScaled = d => this.xScale(this.xAccessor(d));
    this.yAccessorScaled = d => this.yScale(this.yAccessor(d));
    this.y0AccessorScaled = d => this.yScale(this.yScale.domain()[0]);
  }
}
