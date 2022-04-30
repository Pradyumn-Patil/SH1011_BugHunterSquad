# AngularD3ResponsiveGraph

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20.

![../../screenshots/example-15.gif](../../screenshots/example-15.gif)

## Recreating the example

After generating an Angular app using the [Angular CLI](https://github.com/angular/angular-cli), this demo was inspired by [Creating a responsive graph with Angular and D3](https://medium.com/@jeanphilippelemieux/creating-a-responsive-graph-with-angular-and-d3-b45bb8065588)

```sh
# Generate an Angular app using defaults
$ cd examples
$ ng new angular-d3-responsive-graph

# Navigate to the directory of the new app
$ cd angular-d3-responsive-graph

# Add D3 module and types
$ npm install d3 --save
$ npm install @types/d3 --save-dev

# Generate a bar chart component
$ ng generate component bar-chart

# Modify src/app/app.component.html to display our bar chart component
# Create src/assets/data.json - based on data from https://gist.github.com/jplemieux66/54455956beb5f01b2aed39c11036b124
# Create an interface for the data points - src/app/data/data.model.ts
# Add the HTTP client module to src/app/app.module.ts
# Modify src/app/app.component.ts to load our data using the HttpClient
# Pass the data to our chart component by modifying src/app/app.component.html
# Begin integrating the bar chart component in src/app/bar-char/bar-chart.component.html
# Modify src/app/bar-chart/bar-chart.component.ts
# Add some styling to src/app/bar-chart/bar-chart.component.scss
# View the chart

# Modify styling to use the width and height of the component in src/app/bar-chart/bar-chart.component.scss
# Make the chart take 50% of its parent width
# Modify src/app/bar-chart/bar-chart.component.html so we can handle resizing our chart dynamically
# Create the onResize() method in src/app/bar-chart/bar-chart.component.ts

```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
