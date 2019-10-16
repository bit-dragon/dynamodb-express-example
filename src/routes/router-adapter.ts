import { Route } from '../domain/route';

export class RouteAdapter {
  createEndpoints(route: Route) {
    route.createEndpoints();
  }
}
