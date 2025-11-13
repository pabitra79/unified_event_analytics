import { Document, Types } from 'mongoose';

export interface IApiKey extends Document {
  key: string;
  appId: Types.ObjectId;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}