const cors = require('cors');
const { env } = require('./env');

function configureCors() {
  const origins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

  return cors({
    origin: function (origin, callback) {
      if (!origin || origins.includes(origin) || env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Disposition'],
    maxAge: 86400,
  });
}

module.exports = { configureCors };
