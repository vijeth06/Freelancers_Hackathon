const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,

  // Database configuration - MUST be set in .env file
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-meeting-platform',

  // JWT authentication - secrets should be set in environment
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRY: process.env.JWT_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',

  // AI Service - Claude API (Recommended)
  CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
  CLAUDE_MODEL: process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307',

  // AI Service - OpenAI (Alternative)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4',

  // Export Integrations
  TRELLO_API_KEY: process.env.TRELLO_API_KEY,
  TRELLO_API_TOKEN: process.env.TRELLO_API_TOKEN,
  NOTION_API_KEY: process.env.NOTION_API_KEY,

  // Rate limiting configuration
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  AI_RATE_LIMIT_WINDOW_MS: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS, 10) || 60000,
  AI_RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.AI_RATE_LIMIT_MAX_REQUESTS, 10) || 10,

  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

/**
 * Validate required environment variables
 * These must be set in .env file for production
 */
function validateEnv() {
  const required = ['JWT_SECRET', 'JWT_REFRESH_SECRET'];
  const missing = required.filter((key) => !env[key]);
  
  if (missing.length > 0 && env.NODE_ENV !== 'test') {
    const errorMsg = `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please ensure these are set in your .env file.\n` +
      `See .env.example for template.`;
    throw new Error(errorMsg);
  }

  // Warn if using default MongoDB URI (development only)
  if (env.MONGODB_URI === 'mongodb://localhost:27017/ai-meeting-platform' && env.NODE_ENV === 'production') {
    console.warn('⚠️  WARNING: Using default MongoDB URI in production mode. Please set MONGODB_URI in .env');
  }

  // Warn if no AI API key configured
  if (!env.CLAUDE_API_KEY && !env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: No AI API key configured. Set CLAUDE_API_KEY or OPENAI_API_KEY for AI features.');  }
}

module.exports = { env, validateEnv };