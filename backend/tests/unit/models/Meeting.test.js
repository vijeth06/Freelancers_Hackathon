require('../../setup');
const Meeting = require('../../../src/models/Meeting');
const mongoose = require('mongoose');

describe('Meeting Model', () => {
  const userId = new mongoose.Types.ObjectId();

  it('should create a meeting with valid fields', async () => {
    const meeting = await Meeting.create({
      userId,
      title: 'Sprint Planning',
      type: 'sprint-planning',
      rawContent: 'We discussed the sprint goals and user stories.',
    });

    expect(meeting.title).toBe('Sprint Planning');
    expect(meeting.type).toBe('sprint-planning');
    expect(meeting.rawContent).toBe('We discussed the sprint goals and user stories.');
    expect(meeting.userId.toString()).toBe(userId.toString());
    expect(meeting.isArchived).toBe(false);
    expect(meeting.isShared).toBe(false);
  });

  it('should require title', async () => {
    await expect(
      Meeting.create({
        userId,
        rawContent: 'content',
      })
    ).rejects.toThrow(/title/i);
  });

  it('should require rawContent', async () => {
    await expect(
      Meeting.create({
        userId,
        title: 'Test',
      })
    ).rejects.toThrow(/content/i);
  });

  it('should default type to general', async () => {
    const meeting = await Meeting.create({
      userId,
      title: 'General Meeting',
      rawContent: 'Some notes.',
    });

    expect(meeting.type).toBe('general');
  });

  it('should generate and revoke share token', async () => {
    const meeting = await Meeting.create({
      userId,
      title: 'Shareable Meeting',
      rawContent: 'Content here.',
    });

    const token = meeting.generateShareToken();
    expect(token).toBeDefined();
    expect(meeting.isShared).toBe(true);
    expect(meeting.shareToken).toBe(token);

    meeting.revokeShareToken();
    expect(meeting.isShared).toBe(false);
    expect(meeting.shareToken).toBeNull();
  });

  it('should support tags and participants', async () => {
    const meeting = await Meeting.create({
      userId,
      title: 'Tagged Meeting',
      rawContent: 'Content.',
      tags: ['planning', 'q1'],
      participants: ['Alice', 'Bob'],
    });

    expect(meeting.tags).toEqual(['planning', 'q1']);
    expect(meeting.participants).toEqual(['Alice', 'Bob']);
  });

  it('should only allow valid meeting types', async () => {
    await expect(
      Meeting.create({
        userId,
        title: 'Invalid Type',
        rawContent: 'Content.',
        type: 'invalid-type',
      })
    ).rejects.toThrow();
  });
});
