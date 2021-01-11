import { NextFunction, Request, Response } from 'express';
import { camelizeKeys, decamelizeKeys } from 'humps';

export const convertRequestKeysToCamelCase = (req: Request, res: Response, next: NextFunction) => {
  if (!req.url.startsWith('/admin')) {
    if (req.body) {
      req.body = camelizeKeys(req.body);
    }
    if (req.query) {
      req.query = camelizeKeys(req.query);
    }
  }
  next();
};

export const convertResponseKeysToSnakeCase = (req: Request, res: Response, next: NextFunction) => {
  if (!req.url.startsWith('/admin')) {
    const originalSend = res.send;
    res.send = function send(...args) {
      const argsCopy: any[] = [...args];
      argsCopy[0] = decamelizeKeys(argsCopy[0]);
      res.send = originalSend;
      return originalSend.apply(res, argsCopy);
    };
  }
  next();
};
