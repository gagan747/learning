const newrelic = require('newrelic');

const { errorInfo } = require('@tabdigital/api-client');

const log = require('../log');

const handler = (res, { code, message, statusCode }) => {
  res.status(statusCode);

  return res.json({
    error: {
      code,
      message,
    },
  });
};

const serverError = (error, res, msg) => {
  const message = msg || 'Server encountered an Error.';

  log.error(error, message);
  newrelic.noticeError(error);

  return handler(res, {
    code: 'SERVER_ERROR',
    message,
    statusCode: 500,
  });
};

const notFoundError = (error, res, msg) => {
  const message = msg || 'Requested resource was not found.';

  log.warn(error, message);

  return handler(res, {
    code: 'NOT_FOUND',
    message,
    statusCode: 404,
  });
};

const handleError = (error, res, msg) => {
  const errorDetails = errorInfo(error);

  switch (errorDetails.statusCode) {
    case 404: {
      return notFoundError(error, res, msg);
    }
    default: {
      return serverError(error, res, msg);
    }
  }
};

module.exports = {
  handleError,
};
