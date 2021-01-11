import { NextFunction, Request, Response } from 'express';
import * as ErrorHandler from '../utils/error_handlers';

export const handleClientErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  ErrorHandler.clientError(err, res, next);
};

export const handleServerErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  ErrorHandler.serverError(err, res, next);
};
