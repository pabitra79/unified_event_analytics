import { Request, Response, NextFunction } from 'express';
import { 
  eventSchema, 
  eventSummarySchema, 
  userStatsSchema, 
  registerAppSchema 
} from '../helper/validationSchemas';

export const validateEvent = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = eventSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  next();
};

export const validateEventSummary = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = eventSummarySchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  next();
};

export const validateUserStats = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = userStatsSchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  next();
};

export const validateRegisterApp = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = registerAppSchema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  }
  next();
};