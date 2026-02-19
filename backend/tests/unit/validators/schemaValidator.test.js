const {
  validateAnalysisOutput,
  sanitizeAnalysisOutput,
} = require('../../../src/utils/schemaValidator');

describe('Schema Validator', () => {
  describe('validateAnalysisOutput', () => {
    it('should validate a correct analysis output', () => {
      const input = {
        summary: 'Meeting discussed project timeline.',
        keyPoints: ['Timeline is tight', 'Need more resources'],
        actionItems: [
          {
            task: 'Hire new developer',
            owner: 'HR Team',
            deadline: '2026-03-15',
            priority: 'High',
            status: 'Pending',
          },
        ],
      };

      const { valid, errors, value } = validateAnalysisOutput(input);
      expect(valid).toBe(true);
      expect(errors).toBeNull();
      expect(value.summary).toBe(input.summary);
      expect(value.actionItems[0].task).toBe('Hire new developer');
    });

    it('should reject missing summary', () => {
      const input = {
        keyPoints: ['Point'],
        actionItems: [],
      };

      const { valid, errors } = validateAnalysisOutput(input);
      expect(valid).toBe(false);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject empty keyPoints', () => {
      const input = {
        summary: 'Summary',
        keyPoints: [],
        actionItems: [],
      };

      const { valid, errors } = validateAnalysisOutput(input);
      expect(valid).toBe(false);
    });

    it('should reject invalid priority', () => {
      const input = {
        summary: 'Summary',
        keyPoints: ['Point'],
        actionItems: [
          {
            task: 'Task',
            priority: 'Critical',
          },
        ],
      };

      const { valid } = validateAnalysisOutput(input);
      expect(valid).toBe(false);
    });

    it('should reject invalid status', () => {
      const input = {
        summary: 'Summary',
        keyPoints: ['Point'],
        actionItems: [
          {
            task: 'Task',
            status: 'InProgress',
          },
        ],
      };

      const { valid } = validateAnalysisOutput(input);
      expect(valid).toBe(false);
    });

    it('should apply defaults', () => {
      const input = {
        summary: 'Summary',
        keyPoints: ['Point'],
        actionItems: [
          {
            task: 'Task only',
          },
        ],
      };

      const { valid, value } = validateAnalysisOutput(input);
      expect(valid).toBe(true);
      expect(value.actionItems[0].owner).toBe('Unassigned');
      expect(value.actionItems[0].deadline).toBe('Not specified');
      expect(value.actionItems[0].priority).toBe('Medium');
      expect(value.actionItems[0].status).toBe('Pending');
    });

    it('should strip unknown fields', () => {
      const input = {
        summary: 'Summary',
        keyPoints: ['Point'],
        actionItems: [],
        unknownField: 'should be removed',
      };

      const { valid, value } = validateAnalysisOutput(input);
      expect(valid).toBe(true);
      expect(value.unknownField).toBeUndefined();
    });
  });

  describe('sanitizeAnalysisOutput', () => {
    it('should sanitize a valid output', () => {
      const input = {
        summary: '  Summary with spaces  ',
        keyPoints: ['  Point 1  ', '', '  Point 2  '],
        actionItems: [
          {
            task: '  Task  ',
            owner: '  Alice  ',
            deadline: '  2026-03-01  ',
            priority: 'High',
            status: 'Pending',
          },
        ],
      };

      const result = sanitizeAnalysisOutput(input);
      expect(result.summary).toBe('Summary with spaces');
      expect(result.keyPoints).toEqual(['Point 1', 'Point 2']);
      expect(result.actionItems[0].task).toBe('Task');
      expect(result.actionItems[0].owner).toBe('Alice');
    });

    it('should handle null input', () => {
      expect(sanitizeAnalysisOutput(null)).toBeNull();
    });

    it('should handle missing fields', () => {
      const result = sanitizeAnalysisOutput({});
      expect(result.summary).toBe('');
      expect(result.keyPoints).toEqual([]);
      expect(result.actionItems).toEqual([]);
    });

    it('should default invalid priorities and statuses', () => {
      const result = sanitizeAnalysisOutput({
        summary: 'Summary',
        keyPoints: ['Point'],
        actionItems: [
          {
            task: 'Task',
            priority: 'Invalid',
            status: 'Unknown',
          },
        ],
      });

      expect(result.actionItems[0].priority).toBe('Medium');
      expect(result.actionItems[0].status).toBe('Pending');
    });

    it('should filter out action items without tasks', () => {
      const result = sanitizeAnalysisOutput({
        summary: 'Summary',
        keyPoints: ['Point'],
        actionItems: [
          { task: 'Valid task' },
          { task: '' },
          { owner: 'No task here' },
          { task: '   ' },
        ],
      });

      expect(result.actionItems).toHaveLength(1);
      expect(result.actionItems[0].task).toBe('Valid task');
    });
  });
});
