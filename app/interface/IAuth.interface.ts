export interface IGoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface IRegisterRequest {
  name: string;
  websiteUrl: string;
  userId: string;
  userEmail: string;
}

export interface IApiKeyResponse {
  success: boolean;
  appId: string;
  apiKey?: string;
  expiresAt?: Date;
  error?: string;
}