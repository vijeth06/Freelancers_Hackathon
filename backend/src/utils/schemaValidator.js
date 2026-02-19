const Joi = require('joi');

const analysisOutputSchema = Joi.object({
  summary: Joi.string().min(1).max(5000).required(),
  keyPoints: Joi.array().items(Joi.string().min(1).max(1000)).min(1).required(),
  actionItems: Joi.array()
    .items(
      Joi.object({
        task: Joi.string().min(1).max(1000).required(),
        owner: Joi.string().max(200).default('Unassigned'),
        deadline: Joi.string().max(100).default('Not specified'),
        priority: Joi.string().valid('High', 'Medium', 'Low').default('Medium'),
        status: Joi.string().valid('Pending', 'Completed').default('Pending'),
      })
    )
    .default([]),
});

function validateAnalysisOutput(data) {
  const { error, value } = analysisOutputSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details = error.details.map((d) => d.message);
    return { valid: false, errors: details, value: null };
  }

  return { valid: true, errors: null, value };
}

function sanitizeAnalysisOutput(data) {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const sanitized = {
    summary: typeof data.summary === 'string' ? data.summary.trim() : '',
    keyPoints: [],
    actionItems: [],
  };

  if (Array.isArray(data.keyPoints)) {
    sanitized.keyPoints = data.keyPoints
      .filter((kp) => typeof kp === 'string' && kp.trim().length > 0)
      .map((kp) => kp.trim());
  }

  if (Array.isArray(data.actionItems)) {
    sanitized.actionItems = data.actionItems
      .filter((item) => item && typeof item.task === 'string' && item.task.trim().length > 0)
      .map((item) => ({
        task: item.task.trim(),
        owner:
          typeof item.owner === 'string' && item.owner.trim().length > 0
            ? item.owner.trim()
            : 'Unassigned',
        deadline:
          typeof item.deadline === 'string' && item.deadline.trim().length > 0
            ? item.deadline.trim()
            : 'Not specified',
        priority: ['High', 'Medium', 'Low'].includes(item.priority)
          ? item.priority
          : 'Medium',
        status: ['Pending', 'Completed'].includes(item.status)
          ? item.status
          : 'Pending',
      }));
  }

  return sanitized;
}

module.exports = { validateAnalysisOutput, sanitizeAnalysisOutput, analysisOutputSchema };
