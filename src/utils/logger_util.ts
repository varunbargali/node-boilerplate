import { Request, RequestHandler, Response } from 'express';
import * as expressCorrelationID from 'express-correlation-id';
import * as fs from 'fs';
import * as morgan from 'morgan';
import * as os from 'os';
import * as util from 'util';
import { createStream } from 'rotating-file-stream';
import * as path from 'path';
import Logger = require('bunyan');
import config from '../settings/config';

const logFilePath = path.join(`${__dirname}/../../log/`);

// If the log path does not exist, create, else create it.
function mkDirSync(path: string, type: string) {
  try {
    fs.mkdirSync(path);
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }
  return `${path + type}.log`;
}

const logFile = mkDirSync(process.env.LOG_FILE_PATH || logFilePath, 'service');

// create a rotating write stream
const accessLogStream = createStream(
  'access.log',
  {
    interval: '1d', // rotate daily
    path: process.env.LOG_FILE_PATH || logFilePath,
  },
);

morgan.token('hostname', () => os.hostname());
morgan.token('pid', () => String(process.pid));
morgan.token('correlation-id', () => expressCorrelationID.getId());

function jsonFormat(tokens: morgan.TokenIndexer, req: Request, res: Response) {
  return JSON.stringify({
    name: config.serviceName,
    hostname: tokens.hostname(req, res),
    pid: tokens.pid(req, res),
    remote: tokens['remote-addr'](req, res),
    timestamp: tokens.date(req, res, 'iso'),
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    'http-version': tokens['http-version'](req, res),
    status: tokens.status(req, res),
    'content-length': tokens.res(req, res, 'content-length'),
    referrer: tokens.referrer(req, res),
    'response-time (ms)': tokens['response-time'](req, res),
    'user-agent': tokens['user-agent'](req, res),
    'correlation-id': tokens['correlation-id'](req, res),
  });
}

function CustomStdOut() {}
CustomStdOut.prototype.write = function (data) {
  const logObject = JSON.parse(data);

  // Change log level number to name and write it out
  logObject.level = Logger.nameFromLevel[logObject.level].toUpperCase();
  // Updated time to timestamp
  logObject.timestamp = logObject.time;
  delete logObject.time;
  // Add correlation id for debugging
  logObject['correlation-id'] = expressCorrelationID.getId();
  process.stdout.write(`${JSON.stringify(logObject, Logger.safeCycles())}\n`);
};

function CustomRotatingFileStream(options) {
  Logger.RotatingFileStream.call(this, options);
}
util.inherits(CustomRotatingFileStream, Logger.RotatingFileStream);
CustomRotatingFileStream.prototype.write = function (logObject) {
  // Change log level number to name and write it out
  logObject.level = Logger.nameFromLevel[logObject.level].toUpperCase();
  // Updated time to timestamp
  logObject.timestamp = logObject.time;
  delete logObject.time;
  // Add correlation id for debugging
  logObject['correlation-id'] = expressCorrelationID.getId();

  Logger.RotatingFileStream.prototype.write.call(
    this, `${JSON.stringify(logObject, Logger.safeCycles())}\n`,
  );
};

export const logger: Logger = new Logger({
  name: config.serviceName,
  src: true,
  streams: [
    {
      type: 'raw',
      stream: new CustomRotatingFileStream({
        path: logFile,
        period: '1d', // daily rotation
        count: 10, // keep 10 back copies
        level: 'info',
      }),
    },
    {
      level: 'debug',
      stream: new CustomStdOut(),
    },
  ],
});

export const devRequestLogger: RequestHandler = morgan(jsonFormat);
export const requestLogger: RequestHandler = morgan(jsonFormat, { stream: accessLogStream });
