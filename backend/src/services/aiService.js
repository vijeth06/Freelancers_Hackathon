const OpenAI = require('openai');
const { env } = require('../config/env');
const { validateAnalysisOutput, sanitizeAnalysisOutput } = require('../utils/schemaValidator');
const ApiError = require('../utils/apiError');
const logger = require('../utils/logger');

class AIService {
  constructor() {
    this.client = null;
    this.initClient();
  }

  initClient() {
    if (env.OPENAI_API_KEY && env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here') {
      this.client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
      logger.info('OpenAI client initialized');
    } else {
      logger.warn('OpenAI API key not configured. AI analysis will use fallback processing.');
    }
  }

  buildSystemPrompt(meetingType) {
    const typeInstructions = {
      standup:
        'This is a daily standup meeting. Focus on: what was done, what is planned, and any blockers.',
      'sprint-planning':
        'This is a sprint planning meeting. Focus on: sprint goals, user stories, task assignments, and estimates.',
      'client-meeting':
        'This is a client meeting. Focus on: client requirements, agreed deliverables, deadlines, and follow-up actions.',
      academic:
        'This is an academic group project meeting. Focus on: research progress, task distribution, deadlines, and collaboration items.',
      leadership:
        'This is a leadership/management meeting. Focus on: strategic decisions, resource allocation, escalations, and executive actions.',
      general: 'This is a general meeting. Extract all relevant information comprehensively.',
    };

    return `You are a precise meeting notes analyst. Your job is to extract structured information from raw meeting notes.

RULES (STRICT):
1. Be CONSERVATIVE - never invent information not present in the text.
2. Never fabricate names, roles, dates, or tasks that aren't mentioned.
3. If information is ambiguous, mark it clearly (e.g., owner as "Unassigned", deadline as "Not specified").
4. Extract only what is explicitly stated or clearly implied.
5. Use exact names as they appear in the text.
6. For deadlines, use YYYY-MM-DD format when a specific date is mentioned. Otherwise use "Not specified".
7. Assign priority based on context clues (urgency words, deadlines, emphasis). Default to "Medium".
8. Status should be "Pending" unless explicitly marked as done/completed.

MEETING TYPE CONTEXT:
${typeInstructions[meetingType] || typeInstructions.general}

OUTPUT FORMAT (JSON only):
{
  "summary": "A concise 2-4 sentence summary of the meeting",
  "keyPoints": ["Key point 1", "Key point 2", ...],
  "actionItems": [
    {
      "task": "Clear description of the task",
      "owner": "Person name or Unassigned",
      "deadline": "YYYY-MM-DD or Not specified",
      "priority": "High | Medium | Low",
      "status": "Pending | Completed"
    }
  ]
}

Respond ONLY with valid JSON. No explanations, no markdown formatting, no code blocks.`;
  }

  async analyzeMeeting(rawContent, meetingType = 'general') {
    if (this.client) {
      return this.analyzeWithOpenAI(rawContent, meetingType);
    }
    return this.analyzeWithFallback(rawContent, meetingType);
  }

  async analyzeWithOpenAI(rawContent, meetingType) {
    try {
      const systemPrompt = this.buildSystemPrompt(meetingType);

      const response = await this.client.chat.completions.create({
        model: env.OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Analyze the following meeting notes and extract structured information:\n\n${rawContent}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      let parsed;

      try {
        parsed = JSON.parse(content);
      } catch (parseError) {
        logger.error('Failed to parse AI response as JSON:', parseError);
        throw ApiError.internal('AI returned invalid JSON response');
      }

      const sanitized = sanitizeAnalysisOutput(parsed);
      const { valid, errors, value } = validateAnalysisOutput(sanitized);

      if (!valid) {
        logger.error('AI output validation failed:', errors);
        throw ApiError.internal('AI output failed schema validation');
      }

      return {
        analysis: value,
        metadata: {
          model: env.OPENAI_MODEL,
          promptTokens: response.usage?.prompt_tokens,
          completionTokens: response.usage?.completion_tokens,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;

      logger.error('OpenAI API error:', error);

      if (error.status === 429) {
        throw ApiError.tooManyRequests('AI service rate limit exceeded. Please try again later.');
      }
      if (error.status === 401) {
        throw ApiError.serviceUnavailable('AI service authentication failed');
      }

      throw ApiError.serviceUnavailable('AI analysis service is temporarily unavailable');
    }
  }

  analyzeWithFallback(rawContent, meetingType) {
    logger.info('Using fallback analysis (no AI API key configured)');

    const lines = rawContent
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const summary = `Meeting notes contain ${lines.length} line(s) of content. Type: ${meetingType}. Please configure an OpenAI API key for AI-powered analysis.`;

    const keyPoints = [];
    const actionItems = [];

    const actionPatterns = [
      /(?:action[:\s]*|todo[:\s]*|task[:\s]*|(?:need|needs)\s+to\s+|should\s+|must\s+|will\s+)(.+)/i,
      /^[-*]\s*\[[ x]\]\s*(.+)/i,
      /(?:assigned?\s+to\s+|owner[:\s]*)/i,
    ];

    const deadlinePatterns = [
      /(?:by|before|due|deadline)[:\s]*(\d{4}-\d{2}-\d{2})/i,
      /(?:by|before|due|deadline)[:\s]*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{1,2}(?:,?\s*\d{4})?)/i,
    ];

    const ownerPatterns = [
      /(?:assigned?\s+to|owner)[:\s]*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/,
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*[-:]/,
      /@(\w+)/,
    ];

    for (const line of lines) {
      let isAction = false;
      let task = line;

      for (const pattern of actionPatterns) {
        const match = line.match(pattern);
        if (match) {
          isAction = true;
          task = match[1] ? match[1].trim() : line;
          break;
        }
      }

      if (isAction && task.length > 3) {
        let owner = 'Unassigned';
        let deadline = 'Not specified';

        for (const pattern of ownerPatterns) {
          const match = line.match(pattern);
          if (match) {
            owner = match[1].trim();
            break;
          }
        }

        for (const pattern of deadlinePatterns) {
          const match = line.match(pattern);
          if (match) {
            deadline = match[1].trim();
            break;
          }
        }

        const isHighPriority = /urgent|critical|asap|immediately|blocker/i.test(line);
        const isLowPriority = /nice.?to.?have|optional|low.?priority|when.?possible/i.test(line);

        actionItems.push({
          task: task.replace(/^[-*•]\s*/, '').trim(),
          owner,
          deadline,
          priority: isHighPriority ? 'High' : isLowPriority ? 'Low' : 'Medium',
          status: /(?:done|completed|finished|resolved)/i.test(line) ? 'Completed' : 'Pending',
        });
      } else if (line.length > 10 && keyPoints.length < 10) {
        keyPoints.push(line.replace(/^[-*•]\s*/, '').trim());
      }
    }

    if (keyPoints.length === 0) {
      keyPoints.push('Meeting notes recorded. Configure AI API key for detailed analysis.');
    }

    const result = { summary, keyPoints, actionItems };
    const sanitized = sanitizeAnalysisOutput(result);
    const { valid, errors, value } = validateAnalysisOutput(sanitized);

    if (!valid) {
      logger.error('Fallback analysis validation failed:', errors);
      return {
        analysis: {
          summary,
          keyPoints: ['Meeting notes recorded'],
          actionItems: [],
        },
        metadata: { model: 'fallback', promptTokens: 0, completionTokens: 0 },
      };
    }

    return {
      analysis: value,
      metadata: { model: 'fallback', promptTokens: 0, completionTokens: 0 },
    };
  }
}

module.exports = new AIService();
