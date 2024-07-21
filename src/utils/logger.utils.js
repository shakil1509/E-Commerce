const winston = require('winston');
// const { NODE_ENV } = require('../config/env.config');
const NODE_ENV='development'

// Defining severity levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// This method set the current severity based on the current NODE_ENV
const level = () => {
  const env = NODE_ENV || 'development';
  const isDevelopmentEnv = env === 'development';
  return isDevelopmentEnv ? 'debug' : 'warn';
};

// define different colors for each severity level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that your want to link the colors
winston.addColors(colors);

// Chose the aspect of your log customizing the log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define which transport the logger must use to printout messages.
// Using three different transport
const transports = [
  // Allow console to log the message
  new winston.transports.Console(),
  // Allow to print the error level messages inside error.log file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // Allow to print all the error messages inside the all.log file
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// Created the logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

module.exports = logger;