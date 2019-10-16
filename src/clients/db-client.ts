import AWS, { DynamoDB } from 'aws-sdk';

export class DbClient {
  client: AWS.DynamoDB;

  constructor() {
    this.client = new AWS.DynamoDB({
      apiVersion: '2012-08-10',
      endpoint: 'http://localhost:8000',
    });
  }

  instance(): DynamoDB {
    return this.client;
  }
};
