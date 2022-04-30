import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  SimpleChanges,
  OnChanges,
} from "@angular/core";
import * as d3 from "d3";
import { DimensionsType, ScaleType } from "../../utils/types";

@Component({
  selector: "[appAxis]",
  templateUrl: "./axis.component.html",
  styleUrls: ["./axis.component.css"],
})
export class AxisComponent implements OnChanges {
  @Input() dimensions: DimensionsType;
  @Input() dimension: "x" | "y" = "x";
  @Input() scale: ScaleType;
  @Input() label: string;
  // This function will convert a tick value into a human-readable string
  @Input() formatTick: (value: any) => (string|number) = d3.format(",")

  // This will generate an array of ticks and create a <text> element for each one
  private ticks: Function[];

  // In order to use d3.select() to grab an element, we’ll need to use an ElementRef. Let’s create a new ElementRef named axis.
  @ViewChild("axis", { static: true }) axis: ElementRef;

  // Whenever our data changes, update our axis
  ngOnChanges() {
    this.updateTicks();
  }

  // Generates a d3 axis on our targeted element
  updateTicks() {
    if (!this.dimensions || !this.scale) return;
    const numberOfTicks =
      this.dimension == "x"
        ? this.dimensions.boundedWidth < 600
          ? /* Aim for one tick per 100 pixels on small screens */
            this.dimensions.boundedWidth / 100
          : /* For wider screens... */
            this.dimensions.boundedWidth /
            250 /* Aim for one tick per 250 pixels for wider screens on the x-axis... */
        : this.dimensions.boundedHeight /
          70; /*  ...and aim for one tick per 70 pixels on the y axis */

    /**
     * By default, .ticks() will aim for ten ticks, but we can pass a specific count to target. Note that .ticks() will aim for the count, but also tries to create ticks with meaningful intervals: for example, a week in a time scale.
     */
    this.ticks = this.scale.ticks(numberOfTicks);
  }
}
