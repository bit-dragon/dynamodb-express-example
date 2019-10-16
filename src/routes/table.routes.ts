import { Application } from 'express';
import { Route } from '../domain/route';
import { TestTableService } from '../services/test-table.service';

export class TableRoutes extends Route {
  tableService: TestTableService;

  constructor(app: Application) {
    super(app, '/tables');
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

  private get addItemMembersURL(): string {
    return `${this.rootURL}/items/:id/add`;
  }

  private get removeItemMembersURL(): string {
    return `${this.rootURL}/items/:id/delete`;
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

  addItemMember() {
    this.app.put(this.addItemMembersURL, async (req, res) => {
      try {
        const data = await this.tableService.updateItem(req.params.id, req.body.items);
        res.send(data);
      } catch(err) {
        res.status(406).send(err);
      }
    });
  }

  removeItemMember() {
    this.app.put(this.removeItemMembersURL, async (req, res) => {
      try {
        const data = await this.tableService.removeItemMember(req.params.id, req.body.items);
        res.send(data);
      } catch(err) {
        res.status(406).send(err);
      }
    })
  }

  getItemByMember() {
    this.app.get(this.itemsURL, async (req, res) => {
      try {
        const data = await this.tableService.getItemByMember(req.query.id, req.query.member);
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
    this.addItemMember();
    this.removeItemMember();
    this.getItemByMember();
  }
}
