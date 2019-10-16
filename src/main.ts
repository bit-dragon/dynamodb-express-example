import express, { Application } from 'express';
import { DemoApp } from './domain/main-app';
import { Routes } from '../src/routes/routes';
import bodyParser from 'body-parser';

const DEFAULT_PORT = 3000;

interface MainAppOptions {
  port?: number;
}

export default class MainApp implements DemoApp {
  app: Application;
  port: number = DEFAULT_PORT;
  routes: Routes;

  constructor(options: MainAppOptions = {}) {
    this.app = express();
    if (options.port) {
      this.port = options.port;
    }
    this.routes = new Routes(this.app);
  }

  initRoutes() {
    this.routes.init();
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
    this.initRoutes();
    this.initializeServer();
  }
}
