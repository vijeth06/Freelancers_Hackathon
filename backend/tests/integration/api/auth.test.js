require('../../setup');
const request = require('supertest');
const { app } = require('../../../src/server');
const User = require('../../../src/models/User');

describe('Auth API', () => {
  const validUser = {
    email: 'test@example.com',
    password: 'Password123',
    name: 'Test User',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/auth/register').send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(validUser.email);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should reject duplicate email', async () => {
      await request(app).post('/api/auth/register').send(validUser);
      const res = await request(app).post('/api/auth/register').send(validUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, password: '123' });

      expect(res.status).toBe(400);
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, email: 'not-an-email' });

      expect(res.status).toBe(400);
    });

    it('should reject missing fields', async () => {
      const res = await request(app).post('/api/auth/register').send({});

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: 'WrongPass123' });

      expect(res.status).toBe(401);
    });

    it('should reject non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'Password123' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh tokens', async () => {
      const registerRes = await request(app).post('/api/auth/register').send(validUser);
      const { refreshToken } = registerRes.body.data;

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
    });

    it('should reject invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return user profile', async () => {
      const registerRes = await request(app).post('/api/auth/register').send(validUser);
      const { accessToken } = registerRes.body.data;

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(validUser.email);
      expect(res.body.data.name).toBe(validUser.name);
    });

    it('should reject unauthenticated requests', async () => {
      const res = await request(app).get('/api/auth/profile');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const registerRes = await request(app).post('/api/auth/register').send(validUser);
      const { accessToken, refreshToken } = registerRes.body.data;

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
