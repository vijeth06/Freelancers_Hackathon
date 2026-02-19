require('../../setup');
const Analysis = require('../../../src/models/Analysis');
const mongoose = require('mongoose');

describe('Analysis Model', () => {
  const meetingId = new mongoose.Types.ObjectId();
  const userId = new mongoose.Types.ObjectId();

  it('should create an analysis with valid fields', async () => {
    const analysis = await Analysis.create({
      meetingId,
      userId,
      version: 1,
      summary: 'Team discussed sprint progress.',
      keyPoints: ['Frontend work is on track', 'Backend needs more testing'],
      actionItems: [
        {
          task: 'Write unit tests',
          owner: 'Bob',
          deadline: '2026-03-01',
          priority: 'High',
          status: 'Pending',
        },
      ],
    });

    expect(analysis.summary).toBe('Team discussed sprint progress.');
    expect(analysis.keyPoints).toHaveLength(2);
    expect(analysis.actionItems).toHaveLength(1);
    expect(analysis.actionItems[0].owner).toBe('Bob');
    expect(analysis.version).toBe(1);
    expect(analysis.isEdited).toBe(false);
  });

  it('should require summary', async () => {
    await expect(
      Analysis.create({
        meetingId,
        userId,
        version: 1,
        keyPoints: ['Point 1'],
      })
    ).rejects.toThrow(/summary/i);
  });

  it('should require at least one key point', async () => {
    await expect(
      Analysis.create({
        meetingId,
        userId,
        version: 1,
        summary: 'Summary',
        keyPoints: [],
      })
    ).rejects.toThrow();
  });

  it('should default action item fields', async () => {
    const analysis = await Analysis.create({
      meetingId,
      userId,
      version: 1,
      summary: 'Summary',
      keyPoints: ['Point 1'],
      actionItems: [{ task: 'Do something' }],
    });

    const item = analysis.actionItems[0];
    expect(item.owner).toBe('Unassigned');
    expect(item.deadline).toBe('Not specified');
    expect(item.priority).toBe('Medium');
    expect(item.status).toBe('Pending');
  });

  it('should only allow valid priority values', async () => {
    await expect(
      Analysis.create({
        meetingId,
        userId,
        version: 1,
        summary: 'Summary',
        keyPoints: ['Point'],
        actionItems: [{ task: 'Task', priority: 'Invalid' }],
      })
    ).rejects.toThrow();
  });

  it('should only allow valid status values', async () => {
    await expect(
      Analysis.create({
        meetingId,
        userId,
        version: 1,
        summary: 'Summary',
        keyPoints: ['Point'],
        actionItems: [{ task: 'Task', status: 'Invalid' }],
      })
    ).rejects.toThrow();
  });

  it('should track edit history', async () => {
    const analysis = await Analysis.create({
      meetingId,
      userId,
      version: 1,
      summary: 'Original summary',
      keyPoints: ['Point 1'],
    });

    analysis.editHistory.push({
      editedBy: userId,
      changeDescription: 'Updated summary',
      previousData: {
        summary: 'Original summary',
        keyPoints: ['Point 1'],
        actionItems: [],
      },
    });
    analysis.summary = 'Updated summary';
    analysis.isEdited = true;
    await analysis.save();

    expect(analysis.editHistory).toHaveLength(1);
    expect(analysis.editHistory[0].previousData.summary).toBe('Original summary');
    expect(analysis.isEdited).toBe(true);
  });
});
