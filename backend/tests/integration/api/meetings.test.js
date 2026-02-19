require('../../setup');
const request = require('supertest');
const { app } = require('../../../src/server');

describe('Meeting API', () => {
  let accessToken;
  let meetingId;

  const validUser = {
    email: 'meeting@example.com',
    password: 'Password123',
    name: 'Meeting User',
  };

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);
    accessToken = res.body.data.accessToken;
  });

  describe('POST /api/meetings', () => {
    it('should create a meeting', async () => {
      const res = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Sprint Planning',
          type: 'sprint-planning',
          rawContent: 'We discussed the sprint goals.\n- Task 1: Implement login\n- Task 2: Fix bugs',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Sprint Planning');
      expect(res.body.data.rawContent).toContain('sprint goals');
      meetingId = res.body.data._id;
    });

    it('should reject empty content', async () => {
      const res = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Empty Meeting',
          rawContent: '',
        });

      expect(res.status).toBe(400);
    });

    it('should reject missing title', async () => {
      const res = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          rawContent: 'Some content',
        });

      expect(res.status).toBe(400);
    });

    it('should reject unauthenticated requests', async () => {
      const res = await request(app)
        .post('/api/meetings')
        .send({
          title: 'Unauthorized',
          rawContent: 'Content',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/meetings', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Meeting 1',
          rawContent: 'Content 1',
          tags: ['planning'],
        });

      await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Meeting 2',
          rawContent: 'Content 2',
          type: 'standup',
        });
    });

    it('should list user meetings', async () => {
      const res = await request(app)
        .get('/api/meetings')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.meetings).toHaveLength(2);
      expect(res.body.data.pagination.total).toBe(2);
    });

    it('should filter by type', async () => {
      const res = await request(app)
        .get('/api/meetings?type=standup')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.meetings).toHaveLength(1);
      expect(res.body.data.meetings[0].type).toBe('standup');
    });

    it('should search by title', async () => {
      const res = await request(app)
        .get('/api/meetings?search=Meeting 1')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.meetings.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/meetings/:id', () => {
    it('should get meeting by id', async () => {
      const createRes = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Detail Meeting',
          rawContent: 'Detailed content.',
        });

      const res = await request(app)
        .get(`/api/meetings/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Detail Meeting');
    });

    it('should return 404 for non-existent meeting', async () => {
      const res = await request(app)
        .get('/api/meetings/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/meetings/:id', () => {
    it('should update meeting metadata', async () => {
      const createRes = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Original Title',
          rawContent: 'Content',
        });

      const res = await request(app)
        .put(`/api/meetings/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Title',
          tags: ['updated'],
        });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated Title');
      expect(res.body.data.tags).toContain('updated');
    });
  });

  describe('DELETE /api/meetings/:id', () => {
    it('should delete a meeting', async () => {
      const createRes = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'To Delete',
          rawContent: 'Content',
        });

      const res = await request(app)
        .delete(`/api/meetings/${createRes.body.data._id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('PATCH /api/meetings/:id/share', () => {
    it('should enable sharing', async () => {
      const createRes = await request(app)
        .post('/api/meetings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Shareable',
          rawContent: 'Content',
        });

      const res = await request(app)
        .patch(`/api/meetings/${createRes.body.data._id}/share`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.isShared).toBe(true);
      expect(res.body.data.shareToken).toBeDefined();
    });
  });
});
