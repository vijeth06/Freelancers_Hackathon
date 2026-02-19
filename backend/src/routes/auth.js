const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} = require('../validators/authValidator');

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register.bind(authController)
);

router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  authController.login.bind(authController)
);

router.post(
  '/refresh',
  validate(refreshTokenSchema),
  authController.refreshToken.bind(authController)
);

router.post(
  '/logout',
  authenticate,
  authController.logout.bind(authController)
);

router.get(
  '/profile',
  authenticate,
  authController.getProfile.bind(authController)
);

module.exports = router;
