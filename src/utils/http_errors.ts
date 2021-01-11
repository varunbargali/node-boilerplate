export abstract class HTTPClientError extends Error {
    readonly statusCode!: number;

    readonly name!: string;

    error!: object;

    protected constructor(message: object | string, error: object = undefined) {
      if (message instanceof Object) {
        super(JSON.stringify(message));
      } else {
        super(message);
      }
      this.name = this.constructor.name;
      this.error = error;
      Error.captureStackTrace(this, this.constructor);
    }
}

export class HTTP400Error extends HTTPClientError {
    readonly statusCode = 400;

    constructor(error: object = undefined, message: string | object = 'Bad Request') {
      super(message, error);
      if (Array.isArray(this.error)) {
        let errorData = [];
        this.error.forEach((error) => {
          errorData = errorData.concat(Object.values(error.constraints));
        });
        this.error = errorData;
      } else {
        this.error = [message];
      }
    }
}

export class HTTP401Error extends HTTPClientError {
    readonly statusCode = 401;

    constructor(message: string | object = 'Unauthorized') {
      super(message);
      this.error = [message];
    }
}

export class HTTP404Error extends HTTPClientError {
    readonly statusCode = 404;

    constructor(message: string | object = 'Not found') {
      super(message);
      this.error = [message];
    }
}
