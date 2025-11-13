"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyGenerator = void 0;
const crypto_1 = __importDefault(require("crypto"));
class ApiKeyGenerator {
    static generateApiKey() {
        return `sk_${crypto_1.default.randomBytes(32).toString('hex')}`;
    }
    static generateAppId() {
        return `app_${crypto_1.default.randomBytes(16).toString('hex')}`;
    }
    static generateUserId() {
        return `user_${crypto_1.default.randomBytes(16).toString('hex')}`;
    }
    static validateApiKeyFormat(apiKey) {
        const apiKeyRegex = /^sk_[a-f0-9]{64}$/;
        return apiKeyRegex.test(apiKey);
    }
}
exports.ApiKeyGenerator = ApiKeyGenerator;
