interface DBClientResultOptions {
  message: string;
  data?: any;
  err?: any;
  status?: number;
}

export class DBClientResult {
  message: string;
  data?: any;
  err?: any;
  status?: number;

  constructor(opts: DBClientResultOptions = { message: 'Something went wrong!' }) {
    this.message = opts.message;
    this.data = opts.data || null;
    this.err = opts.err || null;
    this.status = opts.status? opts.status : 200;
  }
}
