# App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.20.

![/screenshots/example-16.gif](/screenshots/example-16.gif)

## Cheat sheet

Here are some of the commands that were executed while building this front-end application:

```sh
# Assuming the Angular CLI has been installed on your development machine
$ ng new app

# Install the D3 and Socket.IO libraries
$ npm install d3 socket.io-client

# Install the TypeScript typings
$ npm i @types/d3 @types/socket.io-client -D

# Generate the service for fetching data
$ ng generate service market-status

# Generate a component to display the multi-line D3 chart
$ ng g c market-chart

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
