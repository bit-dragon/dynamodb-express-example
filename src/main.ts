import express, { Application } from 'express';
import { DemoApp } from './domain/main-app';
import { TableRoutes } from './routes/tables';
import { Route } from './domain/route';
import { RouteAdapter } from '../src/routes/router-adapter';
import bodyParser from 'body-parser';

const DEFAULT_PORT = 3000;

interface MainAppOptions {
  port?: number;
}

export default class MainApp implements DemoApp {
  app: Application;
  port: number = DEFAULT_PORT;
  adapter: RouteAdapter;

  constructor(options: MainAppOptions = {}) {
    this.app = express();
    if (options.port) {
      this.port = options.port;
    }
    this.adapter = new RouteAdapter();
  }

  subscribeRoutes() {
    const routes: Route[] = [
      new TableRoutes(this.app),
    ];

    routes.forEach(this.adapter.createEndpoints);
  }

  configure() {
    this.app.use(bodyParser.json());
  }

  initializeServer() {
    this.app.listen(this.port, () => {
      console.log('Example app listening on port 3000');
    });
  }

  run() {
    this.configure();
    this.subscribeRoutes();
    this.initializeServer();
  }
}
