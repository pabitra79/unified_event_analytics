import { Document, Types } from 'mongoose';
export interface IEvent {
  [x: string]: any;
  event: string;
  url: string;
  referrer: string;
  device: string;
  ipAddress: string;
  timestamp: Date;
  metadata: {
    browser: string;
    os: string;
    screenSize: string;
  };
  userId?: string;
  appId: Types.ObjectId;
  userAgent?: string;
}

export interface IEventSummary {
  event: string;
  count: number;
  uniqueUsers: number;
  deviceData: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

export interface IUserStats {
  userId: string;
  totalEvents: number;
  deviceDetails: {
    browser: string;
    os: string;
  };
  ipAddress: string;
  lastActive?: Date;
}

export interface IEventQuery {
  event: string;
  startDate?: string;
  endDate?: string;
  app_id?: string;
}

export interface IUserQuery {
  userId: string;
  app_id?: string;
}

export interface IAnalyticsResponse {
  success: boolean;
  data?: any;
  error?: string;
  cached?: boolean;
}