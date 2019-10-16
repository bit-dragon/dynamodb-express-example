import { Application } from 'express';

export class Route {
  app: Application;
  rootPath: string;

  constructor(app: Application, rootPath: string) {
    this.app = app;
    this.rootPath = rootPath;
  }

  createEndpoints() {
    throw new Error('Not implemented');
  }
}
