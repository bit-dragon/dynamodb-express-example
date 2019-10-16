export interface DemoApp {
  app: any;
  port: number;
  initRoutes(): void;
  configure(): void;
  run(): void;
}
