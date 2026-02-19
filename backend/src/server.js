const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { env, validateEnv } = require('./config/env');
const { connectDatabase } = require('./config/database');
const { configureCors } = require('./config/cors');
const { generalLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const authRoutes = require('./routes/auth');
const meetingRoutes = require('./routes/meetings');
const analysisRoutes = require('./routes/analyses');
const actionItemRoutes = require('./routes/actionItems');
const exportRoutes = require('./routes/export');
const sharedRoutes = require('./routes/shared');

const app = express();

validateEnv();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(configureCors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

if (env.NODE_ENV !== 'test') {
  app.use(
    morgan('short', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

app.use(generalLimiter);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Meeting Platform API is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/action-items', actionItemRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/shared', sharedRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
      });
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
