const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');

const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: env.AI_RATE_LIMIT_WINDOW_MS,
  max: env.AI_RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'AI analysis rate limit exceeded. Please wait before making another request.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Too many authentication attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { generalLimiter, aiLimiter, authLimiter };
