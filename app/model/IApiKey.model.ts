import { Schema, model } from 'mongoose';
import { IApiKey } from '../interface/IApiKey.interface';

const ApiKeySchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  appId: { type: Schema.Types.ObjectId, ref: 'App', required: true },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const ApiKey = model<IApiKey>('ApiKey', ApiKeySchema);