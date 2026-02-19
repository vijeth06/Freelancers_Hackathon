const Joi = require('joi');

const createMeetingSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required().messages({
    'any.required': 'Meeting title is required',
    'string.max': 'Title cannot exceed 200 characters',
  }),
  type: Joi.string()
    .valid('standup', 'sprint-planning', 'client-meeting', 'academic', 'leadership', 'general')
    .default('general'),
  rawContent: Joi.string().min(1).max(100000).required().messages({
    'any.required': 'Meeting content is required',
    'string.max': 'Content cannot exceed 100,000 characters',
  }),
  date: Joi.date().iso().default(null),
  participants: Joi.array().items(Joi.string().trim().max(100)).max(100).default([]),
  tags: Joi.array().items(Joi.string().trim().lowercase().max(50)).max(20).default([]),
});

const updateMeetingSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200),
  type: Joi.string().valid(
    'standup',
    'sprint-planning',
    'client-meeting',
    'academic',
    'leadership',
    'general'
  ),
  date: Joi.date().iso(),
  participants: Joi.array().items(Joi.string().trim().max(100)).max(100),
  tags: Joi.array().items(Joi.string().trim().lowercase().max(50)).max(20),
}).min(1);

const listMeetingsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  type: Joi.string().valid(
    'standup',
    'sprint-planning',
    'client-meeting',
    'academic',
    'leadership',
    'general'
  ),
  tag: Joi.string().trim().lowercase(),
  search: Joi.string().trim().max(200),
  sortBy: Joi.string().valid('date', 'createdAt', 'title').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  archived: Joi.boolean().default(false),
});

module.exports = { createMeetingSchema, updateMeetingSchema, listMeetingsSchema };
