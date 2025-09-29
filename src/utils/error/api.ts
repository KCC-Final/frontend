export class ApiError extends Error {
  status?: number;
  apiMessage?: string;
  apiData?: unknown;
  original?: unknown;

  constructor(opts: {
    message: string;
    status?: number;
    apiMessage?: string;
    apiData?: unknown;
    original?: unknown;
  }) {
    super(opts.message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.status = opts.status;
    this.apiMessage = opts.apiMessage;
    this.apiData = opts.apiData;
    this.original = opts.original;
  }
}
