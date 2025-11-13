import Joi from 'joi';

export const eventSchema = Joi.object({
  event: Joi.string().required().min(1).max(100),
  url: Joi.string().uri().required(),
  referrer: Joi.string().uri().allow(''),
  device: Joi.string().valid('mobile', 'desktop', 'tablet').required(),
  ipAddress: Joi.string().ip().required(),
  timestamp: Joi.date().iso().max('now'),
  metadata: Joi.object({
    browser: Joi.string().max(50),
    os: Joi.string().max(50),
    screenSize: Joi.string().max(20)
  }).optional(),
  userId: Joi.string().max(100).optional()
});

export const eventSummarySchema = Joi.object({
  event: Joi.string().required(),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
  app_id: Joi.string().optional()
});

export const userStatsSchema = Joi.object({
  userId: Joi.string().required(),
  app_id: Joi.string().optional()
});

export const registerAppSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  websiteUrl: Joi.string().uri().required(),
  userEmail: Joi.string().email().required()
});