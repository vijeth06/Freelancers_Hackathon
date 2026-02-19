const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

class AuthService {
  generateAccessToken(userId) {
    return jwt.sign({ userId }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRY,
    });
  }

  generateRefreshToken(userId) {
    return jwt.sign({ userId, type: 'refresh' }, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRY,
    });
  }

  parseExpiry(expiry) {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000;
    const num = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
    return num * (multipliers[unit] || 86400000);
  }

  async register({ email, password, name }) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw ApiError.conflict('An account with this email already exists');
    }

    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
    });

    await user.save();

    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    const expiresAt = new Date(Date.now() + this.parseExpiry(env.JWT_REFRESH_EXPIRY));
    user.refreshTokens.push({ token: refreshToken, expiresAt });
    user.lastLoginAt = new Date();
    await user.save();

    logger.info(`User registered: ${user.email}`);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  async login({ email, password, userAgent }) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account is deactivated');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = this.generateRefreshToken(user._id);

    user.cleanExpiredTokens();
    const expiresAt = new Date(Date.now() + this.parseExpiry(env.JWT_REFRESH_EXPIRY));
    user.refreshTokens.push({ token: refreshToken, expiresAt, userAgent });
    user.lastLoginAt = new Date();
    await user.save();

    logger.info(`User logged in: ${user.email}`);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorized('Refresh token is required');
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired refresh token');
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('User not found or deactivated');
    }

    const storedToken = user.refreshTokens.find(
      (t) => t.token === refreshToken && t.expiresAt > new Date()
    );
    if (!storedToken) {
      throw ApiError.unauthorized('Refresh token not found or expired');
    }

    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);

    const newAccessToken = this.generateAccessToken(user._id);
    const newRefreshToken = this.generateRefreshToken(user._id);

    const expiresAt = new Date(Date.now() + this.parseExpiry(env.JWT_REFRESH_EXPIRY));
    user.refreshTokens.push({ token: newRefreshToken, expiresAt });
    user.cleanExpiredTokens();
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId, refreshToken) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    if (refreshToken) {
      user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
    } else {
      user.refreshTokens = [];
    }

    await user.save();
    logger.info(`User logged out: ${user.email}`);
  }

  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user.toJSON();
  }
}

module.exports = new AuthService();
