import { DynamoDB } from 'aws-sdk';
import { DbClient } from '../clients/db-client';
import uuid from 'uuid/v1';
import {DBClientResult} from '../domain/dbclient';

export class TestTableService {
  tableName: string = 'test';
  dbClient: DynamoDB;

  constructor() {
    const dbClient = new DbClient();
    this.dbClient = dbClient.instance();
  }

  buildParams(extraParams: any) {
    return {
      TableName: this.tableName,
      ...extraParams,
    }
  }

  createTable(): Promise<DBClientResult> {
    return new Promise((resolve, reject) => {
      var params = this.buildParams({
        AttributeDefinitions: [
          {
            AttributeName: 'id',
            AttributeType: 'S'
          },
        ],
        KeySchema: [
          {
            AttributeName: "id",
            KeyType: "HASH"
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      });

      this.dbClient.createTable(params, (err, data) => {
        if (err) {
          reject(new DBClientResult({message: 'Table already exists', err: { err, message: err.stack}}));
        } else {
          resolve(new DBClientResult({message: 'Table created', data}));
        }
      });
    });
  }

  getTables(): Promise<DBClientResult> {
    return new Promise((resolve, reject) => {
      this.dbClient.listTables({}, (err, data) => {
        if (err) {
          reject(new DBClientResult({ message: 'Something went wrong', err: { err, message: err.stack}}));
        } else {
          resolve(new DBClientResult({message: 'Table List', data}));
        }
      });
    });
  }

  insertItem(items: string[]): Promise<DBClientResult> {
    return new Promise((resolve, reject) => {

      if (!items) {
        const message = 'Missing [items] parameter';
        reject(new DBClientResult({ message, err: { message }, status: 400}));
      }

      const id = uuid();

      const params = this.buildParams({
        Item: {
          'id': {
            S: `${id}`,
          },
          'SET_ITEMS': {
            SS: items,
          }
        }
      });

      this.dbClient.putItem(params, (err, data) => {
        if (err) {
          reject(new DBClientResult({ message: 'We were not able to insert the item', status: 500, err: { err, message: err.stack}}));
        } else {
          resolve(new DBClientResult({message: 'Item inserted', data: {id}}));
        }
      });
    });
  }

  updateItem(id: string, newItems: string[] = []): Promise<DBClientResult> {
    return new Promise((resolve, reject) => {
      if (!newItems || !id) {
        const message = 'Missing [items, id] parameters';
        reject(new DBClientResult({ message, err: { message }, status: 400}));
      }

      const params = this.buildParams({
        Key: {
          'id': {
            'S': id,
          },
        },
        UpdateExpression: 'ADD #items :items',
        ExpressionAttributeNames: {
          '#items': 'SET_ITEMS',
        },
        ExpressionAttributeValues: {
          ':items': {
            'SS': newItems,
          }
        },
        ReturnValues: 'ALL_NEW'
      });

      this.dbClient.updateItem(params, (err, data) => {
        if (err) {
          reject(new DBClientResult({ message: 'We were not able to update the item', status: 500, err: { err, message: err.stack}}));
        } else {
          resolve(new DBClientResult({message: 'Item inserted', data: {id}}));
        }
      });
    })
  }

  removeItemMember(id: string, newItems: string[] = []): Promise<DBClientResult> {
    return new Promise((resolve, reject) => {
      if (!newItems || !id) {
        const message = 'Missing [items, id] parameters';
        reject(new DBClientResult({ message, err: { message }, status: 400}));
      }

      const params = this.buildParams({
        Key: {
          'id': {
            'S': id,
          },
        },
        UpdateExpression: 'DELETE #items :items',
        ExpressionAttributeNames: {
          '#items': 'SET_ITEMS',
        },
        ExpressionAttributeValues: {
          ':items': {
            'SS': newItems,
          }
        },
        ReturnValues: 'ALL_NEW'
      });

      this.dbClient.updateItem(params, (err, data) => {
        if (err) {
          reject(new DBClientResult({ message: 'We were not able to update the item', status: 500, err: { err, message: err.stack}}));
        } else {
          resolve(new DBClientResult({message: 'Item inserted', data: {id}}));
        }
      });
    })
  }

  getItemByMember(id: string, member: string): Promise<DBClientResult> {
    return new Promise((resolve, reject) => {

      if (!id || !member) {
        const message = 'Missing [id] or [member] parameter';
        reject(new DBClientResult({ message, err: { message }, status: 400}));
      }

      const params = this.buildParams({
        KeyConditionExpression: "id = :id",
        FilterExpression: 'contains(SET_ITEMS, :member)',
        ExpressionAttributeValues: {
          ":id": {
            S: id,
          },
          ":member": {
            S: member,
          }
        }
      });

      this.dbClient.query(params, (err, data) => {
        if (err) {
          reject(new DBClientResult({ message: 'We were not able to retrieve any item', err: { err, message: err.stack}}));
        } else {
          resolve(new DBClientResult({message: 'Item List', data}));
        }
      });
    })
  }
}
