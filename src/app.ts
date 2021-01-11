import * as bodyParser from 'body-parser';
import * as expressCorrelationID from 'express-correlation-id';
import * as express from 'express';
import * as Sentry from '@sentry/node';
import * as i18nextMiddleware from 'i18next-express-middleware';
import * as Backend from 'i18next-node-fs-backend';
import * as cors from 'cors';
import Routes from './routes';
import config from './settings/config';
import { devRequestLogger, logger, requestLogger } from './utils/logger_util';
import apmAgent from './utils/elastic_apm';

const i18next = require('i18next');

class App {
  public app: express.Application;

  public apmAgent;

  private routes: Routes = new Routes();

  constructor() {
    // Elastic APM
    this.apmAgent = apmAgent;
    // Handling uncaught errors
    App.handleErrors();

    this.app = express();
    this.config();
    this.routes.register(this.app);
  }

  private config(): void {
    this.app.set('port', config.port);

    this.app.use(Sentry.Handlers.requestHandler());

    const corsOptions = {
      origin: config.cors.origins.split(','),
      methods: '*',
      allowedHeaders: '*',
      credentials: true,
    };
    this.app.use(cors(corsOptions));

    i18next
      .use(Backend)
      .use(i18nextMiddleware.LanguageDetector)
      .init({
        backend: {
          loadPath: `${__dirname}/locales/{{lng}}/{{ns}}.json`,
        },
        fallbackLng: 'en',
        preload: ['en', 'hn', 'he'],
      });

    this.app.use(i18nextMiddleware.handle(i18next));

    this.app.use(expressCorrelationID(config.correlationHeader));

    this.app.use(bodyParser.json({ limit: '100mb' }));
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use(requestLogger);

    if (config.envName === 'local') {
      this.app.use(devRequestLogger);
    }
  }

  private static handleErrors(): void {
    // Sentry Setup
    if (process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: config.envName,
      });
    }

    // Handle uncaught fatal errors
    process
      .on('uncaughtException', (error) => {
        logger.fatal(error);
        // Close the sentry client
        const client = Sentry.getCurrentHub().getClient();
        if (client) {
          client.captureException(error);
          client.close(30000).then(() => {
            process.exit(1);
          });
        }
      })
      .on('unhandledRejection', (reason) => {
        logger.fatal(reason);
        // Close the sentry client
        const client = Sentry.getCurrentHub().getClient();
        if (client) {
          client.captureEvent(reason);
          client.close(30000).then(() => {
            process.exit(1);
          });
        }
      });
  }
}

export default new App().app;
