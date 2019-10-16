import { DynamoDB } from 'aws-sdk';
import { Application } from 'express';
import { Route } from '../domain/route';
import { DbClient } from '../lib/db-client';
import { TestTableService } from '../services/test-table.service';

export class TableRoutes extends Route {
  dbClient: DynamoDB;
  tableService: TestTableService;

  constructor(app: Application) {
    const dbClient = new DbClient();
    super(app, '/tables');
    this.dbClient = dbClient.instance();
    this.tableService = new TestTableService();
  }

  private get rootURL(): string {
    return `${this.rootPath}`;
  }

  private get createTableURL(): string {
    return `${this.rootPath}/init`;
  }

  private get tablesURL(): string {
    return `${this.rootURL}`;
  }

  private get itemsURL(): string {
    return `${this.rootURL}/items`;
  }

  createTable() {
    this.app.post(this.createTableURL, async (req, res) => {
      try {
        const data = await this.tableService.createTable();
        res.send(data);
      } catch(err) {
        res.status(406).send(err);
      }
    });
  }

  getTables() {
    this.app.get(this.tablesURL, async (req, res) => {
      try {
        const data = await this.tableService.getTables();
        res.send(data);
      } catch(err) {
        res.status(406).send(err);
      }
    });
  }

  insertItem() {
    this.app.post(this.itemsURL, async (req, res) => {
      try {
        const data = await this.tableService.insertItem(req.body.items);
        res.send(data);
      } catch(err) {
        res.status(err.status).send(err);
      }
    });
  }

  getItemList() {
    this.app.get(this.itemsURL, async (req, res) => {
      try {
        const data = await this.tableService.getItemList(req.query.id);
        res.send(data);
      } catch(err) {
        res.status(406).send(err);
      }
    });
  }

  createEndpoints() {
    this.createTable();
    this.getTables();
    this.insertItem();
    this.getItemList();
  }
}
