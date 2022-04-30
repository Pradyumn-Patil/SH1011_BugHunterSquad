# Welcome

This example requires you have [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and configured on your development machine. It was based off the tutorial [Real-Time Charts using Angular, D3, and Socket.IO](https://auth0.com/blog/real-time-charts-using-angular-d3-and-socket-io/).

## Getting started

This example contains a front-end [Angular](https://angular.io) application as well as a back-end [Express](https://expressjs.com) server.

To run the example, make sure you're at the top level directory of this project. You will want to modify the following scripts in `package.json` so they refer to the appropriate `docker-compose.angular-d3-real-time-socket-io.yml` Docker compose file:

```sh
# package.json
"angular:docker:up": "docker-compose -f docker-compose.angular-d3-real-time-socket-io.yml up",
"angular:docker:build": "docker-compose -f docker-compose.angular-d3-real-time-socket-io.yml up --remove-orphans --build --force-recreate",
"angular:docker:down": "docker-compose -f docker-compose.angular-d3-real-time-socket-io.yml down",
```

```sh
$ npm run angular:start
```

You should be able to view the app at [http://localhost:4200](http://localhost:4200)

## Building the application from scratch

This tutorial includes two main applications that will be built:

+ The back-end [Express](https://expressjs.com) server providing live updates using [Socket.IO](https://socket.io)
+ The front-end [Angular](https://angular.io) web application

### Back-end - Express server using Socket.IO

### Front-end - Angular web application
