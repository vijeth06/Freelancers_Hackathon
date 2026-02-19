const Joi = require('joi');

const updateAnalysisSchema = Joi.object({
  summary: Joi.string().trim().min(1).max(5000),
  keyPoints: Joi.array().items(Joi.string().min(1).max(1000)).min(1),
  actionItems: Joi.array().items(
    Joi.object({
      _id: Joi.string().optional(),
      task: Joi.string().min(1).max(1000).required(),
      owner: Joi.string().max(200).default('Unassigned'),
      deadline: Joi.string().max(100).default('Not specified'),
      priority: Joi.string().valid('High', 'Medium', 'Low').default('Medium'),
      status: Joi.string().valid('Pending', 'Completed').default('Pending'),
    })
  ),
  changeDescription: Joi.string().trim().max(500),
}).min(1);

const updateActionItemSchema = Joi.object({
  task: Joi.string().min(1).max(1000),
  owner: Joi.string().max(200),
  deadline: Joi.string().max(100),
  priority: Joi.string().valid('High', 'Medium', 'Low'),
  status: Joi.string().valid('Pending', 'Completed'),
}).min(1);

const actionItemFilterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
  status: Joi.string().valid('Pending', 'Completed'),
  priority: Joi.string().valid('High', 'Medium', 'Low'),
  owner: Joi.string().trim().max(200),
  fromDate: Joi.date().iso(),
  toDate: Joi.date().iso(),
  sortBy: Joi.string().valid('deadline', 'priority', 'status', 'createdAt').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = { updateAnalysisSchema, updateActionItemSchema, actionItemFilterSchema };
