import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import * as d3 from "d3";
import { AccessorType } from "../../utils/types";

@Component({
  /**
   * We’re defining our selector using square brackets ([]). This makes it an attribute selector, which specifies that our component must be used as an attribute on another element. For example, we’ll need to use our line component with the code <svg:g app-line />, and not <app-line />.
   */
  selector: "[appLine]",

  /**
   * We’ll be defining our template inline. This will keep our code concise, since our line template will only be a few lines.
   */
  template: `
    <svg:path
      [ngClass]="type"
      [attr.d]="lineString"
      [style.fill]="fill"
    ></svg:path>
  `,

  styleUrls: ["./line.component.css"],
})

/**
 * We could use a @Directive instead of a @Component here. The difference is that a directive will alter an externally created DOM element.
Using a directive would force anyone who wants to use our line component to know that they need to use a <path> element. We’ll instead use a component so that all of our chart elements can be created with a <svg:g> element.
 */
export class LineComponent implements OnChanges {
  @Input() type: "area" | "line" = "line";
  @Input() data: object[];
  @Input() xAccessor: AccessorType;
  @Input() yAccessor: AccessorType;
  @Input() y0Accessor?: AccessorType;
  @Input() interpolation?: Function = d3.curveMonotoneX;
  @Input() fill?: string;

  private lineString: ""; // This will hold our d attribute string that will tell the line what shape to be.

  // Update whenever any of the properties of our component change
  ngOnChanges(changes: SimpleChanges): void {
    this.updateLineString();
  }

  updateLineString(): void {
    const lineGenerator = d3[this.type]()
      .x(this.xAccessor)
      .y(this.yAccessor)
      .curve(this.interpolation);
    if (this.type == "area") {
      lineGenerator.y0(this.y0Accessor).y1(this.yAccessor);
    }
    this.lineString = lineGenerator(this.data);
  }
}
