import { ConnectionOptions, connect, Mongoose } from 'mongoose';
import Sentry from '@sentry/node';

import { logger } from '../utils/logger_util';
import config from '../settings/config';

const connectMongoDB = async (): Promise<Mongoose> => {
  try {
    const { mongoURI } = config;
    const options: ConnectionOptions = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    };
    return await connect(mongoURI, options);
  } catch (error) {
    const client = Sentry.getCurrentHub().getClient();
    if (client) {
      client.captureException(error);
    }
    logger.error('Mongoose encountered error while connecting to database: ', error);
    // Exit process with failure
    process.exit(1);
    return null;
  }
};

export default connectMongoDB;
