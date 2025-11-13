import { Request, Response, NextFunction } from 'express';
import {ApiKey} from '../model/IApiKey.model';

export const authenticateApiKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      res.status(401).json({ error: 'API key is required in x-api-key header' });
      return;
    }

    const keyData = await ApiKey.aggregate([
      {
        $match: {
          key: apiKey,
          isActive: true,
          expiresAt: { $gt: new Date() }
        }
      },
      {
        $lookup: {
          from: 'apps',
          localField: 'appId',
          foreignField: '_id',
          as: 'app'
        }
      },
      {
        $unwind: '$app'
      },
      {
        $limit: 1
      }
    ]);

    if (keyData.length === 0) {
      res.status(401).json({ error: 'Invalid or expired API key' });
      return;
    }

    (req as any).app = keyData[0].app;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};