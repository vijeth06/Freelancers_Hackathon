const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://SubashP:subash25@cluster0.ib61c1f.mongodb.net/ai-meeting-platform',

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',

  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4',

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  AI_RATE_LIMIT_WINDOW_MS: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS, 10) || 60000,
  AI_RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.AI_RATE_LIMIT_MAX_REQUESTS, 10) || 10,

  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

function validateEnv() {
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter((key) => !env[key]);
  if (missing.length > 0 && env.NODE_ENV !== 'test') {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

module.exports = { env, validateEnv };
