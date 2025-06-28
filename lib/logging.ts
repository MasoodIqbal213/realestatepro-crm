/**
 * lib/logging.ts
 * This file sets up logging for the CRM using Winston.
 * Why? Logging is critical for troubleshooting, auditing, and compliance. We log user actions, system events, and errors in separate files.
 * How? Each logger writes to a rotating file (daily) and to the console in development.
 *
 * How to use: Import the logger you need and call logger.info(), logger.error(), etc.
 */

import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

// Directory where logs will be stored
const logDir = path.join(process.cwd(), 'logs');

// Helper to create a rotating file transport
function createFileTransport(filename: string) {
  return new winston.transports.DailyRotateFile({
    filename: path.join(logDir, filename),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d', // Keep 14 days of logs
    level: 'info',
  });
}

// User actions logger (e.g., login, CRUD, permission changes)
export const userActionLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    createFileTransport('user-actions.log'),
    new winston.transports.Console({
      format: winston.format.simple(),
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    }),
  ],
});

// System events logger (e.g., startup, shutdown, config changes)
export const systemLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    createFileTransport('system.log'),
    new winston.transports.Console({
      format: winston.format.simple(),
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    }),
  ],
});

// Error logger (e.g., exceptions, failed logins, DB errors)
export const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    createFileTransport('error.log'),
    new winston.transports.Console({
      format: winston.format.simple(),
      level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    }),
  ],
});

// Example usage:
// userActionLogger.info({ user: 'admin@crm.com', action: 'login', realEstate: 'ABC', time: new Date() });
// systemLogger.info({ event: 'server_start', time: new Date() });
// errorLogger.error({ error: 'Failed to connect to MongoDB', details: err }); 