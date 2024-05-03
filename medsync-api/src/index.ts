import { Server } from 'http';
import app from './app';
import prisma from './client';
import config from './config/config';
import logger from './config/logger';
import { getNeosyncContext } from './config/neosync';
import { GetUserRequest } from '@neosync/sdk';

let server: Server;
const client = getNeosyncContext();

prisma.$connect().then(() => {
  logger.info('Connected to SQL Database');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
  //Test COnnection to Neosync
  client.users
    .getUser(new GetUserRequest())
    .then(() => {
      logger.info('Connected to Neosync');
    })
    .catch((err) => {
      logger.error('Failed to connect to Neosync', err);
    });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
