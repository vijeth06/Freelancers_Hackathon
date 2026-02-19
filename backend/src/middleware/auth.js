const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const ApiError = require('../utils/apiError');
const User = require('../models/User');
const logger = require('../utils/logger');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Access token is required');
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password -refreshTokens');

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated');
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(ApiError.unauthorized('Access token has expired'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(ApiError.unauthorized('Invalid access token'));
    }
    next(error);
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }
    next();
  };
}

module.exports = { authenticate, authorize };
