import { Schema, model } from 'mongoose';
import { IEvent } from '../interface/IAnalytics.interface';

const EventSchema: Schema = new Schema({
  event: { type: String, required: true },
  url: { type: String, required: true },
  referrer: { type: String, default: '' },
  device: { type: String, enum: ['mobile', 'desktop', 'tablet'], required: true },
  ipAddress: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: {
    browser: String,
    os: String,
    screenSize: String
  },
  userId: String,
  appId: { type: Schema.Types.ObjectId, ref: 'App', required: true },
  userAgent: String
}, {
  timestamps: true
});

// Indexes for better query performance
EventSchema.index({ appId: 1, event: 1, timestamp: -1 });
EventSchema.index({ appId: 1, userId: 1 });
EventSchema.index({ timestamp: -1 });
EventSchema.index({ appId: 1, timestamp: -1 });

export const Event = model<IEvent>('Event', EventSchema);