import { Document } from 'mongoose';

export interface IApp extends Document {
  name: string;
  websiteUrl: string;
  userId: string;
  userEmail: string;
  appId:string;
  createdAt: Date;
}