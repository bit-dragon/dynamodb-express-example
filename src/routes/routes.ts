import { Application } from 'express';
import { Route } from '../domain/route';
import { RouteAdapter } from './router-adapter';
import { TableRoutes } from './tables';

export class Routes {
  routes: Route[] = [];
  adapter: RouteAdapter;

  constructor(private app: Application ) {
    this.app = app;
    this.adapter = new RouteAdapter();
  }

  init() {
    this.routes = [
      new TableRoutes(this.app),
    ];

    this.routes.forEach(this.adapter.createEndpoints);
  }
}
