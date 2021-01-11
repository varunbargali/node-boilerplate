import {
  NextFunction, Request, Response, Router,
} from 'express';
import { AppRoute } from '../types';

export default function registerRoutes(routes: AppRoute[]): Router {
  const router = Router();
  routes.forEach((route) => {
    router[route.method](
      route.path, (request: Request, response: Response, next: NextFunction) => {
        route.action(request, response)
          .then(() => next)
          .catch((err) => next(err));
      },
    );
  });
  return router;
}
