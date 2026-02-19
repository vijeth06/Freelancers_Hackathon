require('../../setup');
const User = require('../../../src/models/User');

describe('User Model', () => {
  it('should create a user with valid fields', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Password123',
      name: 'Test User',
    };

    const user = await User.create(userData);

    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user.role).toBe('user');
    expect(user.isActive).toBe(true);
    expect(user.password).not.toBe('Password123');
  });

  it('should hash the password before saving', async () => {
    const user = await User.create({
      email: 'hash@example.com',
      password: 'Password123',
      name: 'Hash Test',
    });

    const userWithPassword = await User.findById(user._id).select('+password');
    expect(userWithPassword.password).not.toBe('Password123');
    expect(userWithPassword.password.startsWith('$2a$')).toBe(true);
  });

  it('should compare passwords correctly', async () => {
    const user = await User.create({
      email: 'compare@example.com',
      password: 'Password123',
      name: 'Compare Test',
    });

    const userWithPassword = await User.findById(user._id).select('+password');
    const isMatch = await userWithPassword.comparePassword('Password123');
    const isWrong = await userWithPassword.comparePassword('WrongPassword');

    expect(isMatch).toBe(true);
    expect(isWrong).toBe(false);
  });

  it('should not allow duplicate emails', async () => {
    await User.create({
      email: 'dup@example.com',
      password: 'Password123',
      name: 'Dup User',
    });

    await expect(
      User.create({
        email: 'dup@example.com',
        password: 'Password456',
        name: 'Dup User 2',
      })
    ).rejects.toThrow();
  });

  it('should require email', async () => {
    await expect(
      User.create({
        password: 'Password123',
        name: 'No Email',
      })
    ).rejects.toThrow(/email/i);
  });

  it('should require password', async () => {
    await expect(
      User.create({
        email: 'nopass@example.com',
        name: 'No Password',
      })
    ).rejects.toThrow(/password/i);
  });

  it('should require name', async () => {
    await expect(
      User.create({
        email: 'noname@example.com',
        password: 'Password123',
      })
    ).rejects.toThrow(/name/i);
  });

  it('should clean expired tokens', async () => {
    const user = await User.create({
      email: 'tokens@example.com',
      password: 'Password123',
      name: 'Token Test',
    });

    user.refreshTokens = [
      {
        token: 'valid-token',
        expiresAt: new Date(Date.now() + 86400000),
      },
      {
        token: 'expired-token',
        expiresAt: new Date(Date.now() - 86400000),
      },
    ];

    user.cleanExpiredTokens();
    expect(user.refreshTokens).toHaveLength(1);
    expect(user.refreshTokens[0].token).toBe('valid-token');
  });

  it('should exclude password and refreshTokens from JSON', async () => {
    const user = await User.create({
      email: 'json@example.com',
      password: 'Password123',
      name: 'JSON Test',
    });

    const json = user.toJSON();
    expect(json.password).toBeUndefined();
    expect(json.refreshTokens).toBeUndefined();
    expect(json.__v).toBeUndefined();
  });
});
