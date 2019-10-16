export interface DemoApp {
  app: any;
  port: number;
  subscribeRoutes(): void;
  run(): void;
}
