import crypto from 'crypto';

export class ApiKeyGenerator {
  static generateApiKey(): string {
    return `sk_${crypto.randomBytes(32).toString('hex')}`;
  }

  static generateAppId(): string {
    return `app_${crypto.randomBytes(16).toString('hex')}`;
  }

  static generateUserId(): string {
    return `user_${crypto.randomBytes(16).toString('hex')}`;
  }

  static validateApiKeyFormat(apiKey: string): boolean {
    const apiKeyRegex = /^sk_[a-f0-9]{64}$/;
    return apiKeyRegex.test(apiKey);
  }
}