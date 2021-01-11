import * as express from 'express';
import { Application } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerJsdoc from 'swagger-jsdoc';
import * as Sentry from '@sentry/node';
import registerRoutes from './utils/route_util';
import { AppRoute } from './types';
import { handleClientErrors, handleServerErrors } from './middleware/error_handlers';
import * as swaggerDocument from './swagger/swaggerOptions.json';
import userAppRoutes from './modules/insurance/routes/user';
import healthCheckRoutes from './modules/common/routes/health_check';

export default class Routes {
  public register(app: Application) {
    // Register open API routes here.
    const openRoutes: AppRoute[] = [];

    const contactRoutes = registerRoutes(userAppRoutes);
    const apiRouter = express.Router();
    const healthCheckRouter = registerRoutes(healthCheckRoutes);
    const v1OpenRoutes = registerRoutes(openRoutes);
    apiRouter.use('/v1', [v1OpenRoutes, contactRoutes]);

    // Register routes in the app
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerDocument), { explorer: true }));
    app.use('/api', apiRouter);
    app.use('/', healthCheckRouter);

    app.use(Sentry.Handlers.errorHandler());
    app.use([handleClientErrors, handleServerErrors]);
  }
}
