import 'reflect-metadata';
import * as os from 'os';
import * as cluster from 'cluster';
import { logger } from './utils/logger_util';
import app from './app';
import connectMongoDB from './databases/mongo';

async function startServer() {
  // create connection with databases
  await connectMongoDB();

  const clusterWorkerSize = os.cpus().length;

  if (clusterWorkerSize > 1 && process.env.ENV_NAME !== 'local') {
    if (cluster.isMaster) {
      for (let i = 0; i < clusterWorkerSize; i += 1) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        if (code === 0) {
          logger.info(`worker ${worker.process.pid} died`);
        } else {
          logger.info(`worker ${worker.process.pid} died with exit code ${code} and signal ${signal}, restarting it`);
          cluster.fork();
        }
      });
    } else {
      app.listen(app.get('port'), () => {
        logger.info(`Express server listening on port ${app.get('port')} and worker ${process.pid}`);
      });
    }
  } else {
    app.listen(app.get('port'), () => {
      logger.info(
        `Express server listening on port ${app.get('port')} with the single worker ${process.pid}`,
      );
    });
  }
}

startServer();
