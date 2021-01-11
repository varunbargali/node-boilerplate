import { NextFunction, Response } from 'express';
import { HTTPClientError } from './http_errors';
import { logger } from './logger_util';

export const clientError = (err: Error, res: Response, next: NextFunction) => {
  if (err instanceof HTTPClientError) {
    logger.info(err.message);
    res.status(err.statusCode).header({ 'Content-Type': 'application/json' }).send({
      success: false,
      message: err.message,
      errors: err.error,
    });
  } else {
    next(err);
  }
};

export const serverError = (err: Error, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  if (process.env.ENV_NAME === 'local') {
    res.status(500).send(err.stack);
  } else {
    res.status(500).send('Internal Server Error');
  }
};
