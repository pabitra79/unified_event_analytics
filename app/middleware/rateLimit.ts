import rateLimit from 'express-rate-limit';

// Rate limiting for event collection
export const eventRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  message: {
    error: 'Too many events submitted from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
   
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
});


export const analyticsRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 60, 
  message: {
    error: 'Too many analytics requests, please try again after a minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    
    return req.ip || req.socket.remoteAddress || 'unknown';
  }
});