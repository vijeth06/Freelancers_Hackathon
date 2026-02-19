const logger = require('../utils/logger');
const ApiError = require('../utils/apiError');
const { env } = require('../config/env');

function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    if (error.name === 'ValidationError') {
      const details = Object.values(error.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      error = ApiError.badRequest('Validation failed', details);
    } else if (error.name === 'CastError') {
      error = ApiError.badRequest(`Invalid ${error.path}: ${error.value}`);
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyValue).join(', ');
      error = ApiError.conflict(`Duplicate value for field: ${field}`);
    } else if (error.name === 'JsonWebTokenError') {
      error = ApiError.unauthorized('Invalid token');
    } else if (error.name === 'TokenExpiredError') {
      error = ApiError.unauthorized('Token expired');
    } else {
      error = ApiError.internal(
        env.NODE_ENV === 'production' ? 'Internal server error' : err.message
      );
    }
  }

  if (error.statusCode >= 500) {
    logger.error(`${error.statusCode} - ${error.message}`, {
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.warn(`${error.statusCode} - ${error.message}`, {
      url: req.originalUrl,
      method: req.method,
    });
  }

  const response = {
    success: false,
    error: error.message,
  };

  if (error.details) {
    response.details = error.details;
  }

  if (env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  res.status(error.statusCode).json(response);
}

function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = { errorHandler, notFoundHandler };
