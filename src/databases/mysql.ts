import { createConnections } from 'typeorm';
import * as Sentry from '@sentry/node';

import { logger } from '../utils/logger_util';

const connectMySQLDB = async () => {
  try {
    // note that it's not active database connection
    // TypeORM creates connection pools and uses them for your requests
    await createConnections(require('../settings/ormconfig.js'));
  } catch (error) {
    const client = Sentry.getCurrentHub().getClient();
    if (client) {
      client.captureException(error);
    }
    logger.error('TypeORM encountered error while connecting to database: ', error);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectMySQLDB;
