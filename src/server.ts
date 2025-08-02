import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import config from './config';
import { seedSuperAdmin } from './DB/seedAdmin';

import { socketHelper } from './helpers/socketHelper';
import { errorLogger, logger } from './shared/looger';


// Declare global io for TypeScript
declare global {
  var io: Server;
}

// Uncaught exception handling
process.on('uncaughtException', error => {
  errorLogger.error('Uncaught Exception Detected', error);
  process.exit(1);
});

let server: any;
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info(colors.green('🚀 Database connected successfully'));

    // Seed Super Admin
    await seedSuperAdmin();

    const port = typeof config.port === 'number' ? config.port : Number(config.port);

    server = app.listen(port, config.ip_address as string, () => {
      logger.info(colors.yellow(`♻️ Application listening on port:${port}`));
    });

    // Socket.IO setup
    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: '*',
      },
    });

    // Socket.IO error handling
    io.on('error', (error) => {
      errorLogger.error('Socket.IO error:', error);
    });

    socketHelper.socket(io);
    globalThis.io = io; // Set global io for services

  } catch (error) {
    errorLogger.error(colors.red('🤢 Failed to connect Database'), error);
    process.exit(1);
  }

  // Unhandled rejection handling
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorLogger.error('Unhandled Rejection Detected', error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

// SIGTERM handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED');
  if (server) {
    server.close(() => {
      process.exit(0);
    });
  }
});