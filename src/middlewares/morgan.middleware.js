const morgan = require('morgan');
const logger = require('../utils/logger.utils');
// const { NODE_ENV } = require('../config/env.config');

const myStream = {
  // Use the http severity
  write: (message) => logger.http(message),
};

const skip = () => {
  const env = NODE_ENV || 'development';
  return env !== 'development';
};

const morganMiddleware = morgan(
  // Define the message format string
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream: myStream }
);

module.exports = morganMiddleware;