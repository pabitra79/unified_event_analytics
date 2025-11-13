"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const crypto_1 = __importDefault(require("crypto"));
const IApp_Repository_1 = require("../repository/IApp.Repository");
const ApiKey_Repository_1 = require("../repository/ApiKey.Repository");
class AuthController {
    constructor() {
        // Handle Google OAuth callback
        this.handleGoogleCallback = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                res.json({
                    success: true,
                    message: 'Google authentication successful',
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    }
                });
            }
            catch (error) {
                console.error('Google callback error:', error);
                res.status(500).json({ error: 'Authentication failed' });
            }
        });
        // Register new app
        this.registerApp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, websiteUrl, userEmail } = req.body;
                const userId = crypto_1.default.randomBytes(16).toString('hex');
                const app = yield this.appRepository.createApp({
                    name,
                    websiteUrl,
                    userId,
                    userEmail
                });
                const apiKey = yield this.apiKeyRepository.createApiKey({
                    key: this.generateApiKey(),
                    appId: app._id,
                    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1year 
                });
                res.status(201).json({
                    success: true,
                    appId: app._id,
                    apiKey: apiKey.key,
                    expiresAt: apiKey.expiresAt,
                    message: 'App registered successfully'
                });
            }
            catch (error) {
                console.error('Register app error:', error);
                res.status(500).json({ error: 'Failed to register application' });
            }
        });
        this.getApiKey = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { appId, userId } = req.query;
                if (!appId || !userId) {
                    res.status(400).json({ error: 'appId and userId are required' });
                    return;
                }
                const app = yield this.appRepository.findAppByUserAndId(userId, appId);
                if (!app) {
                    res.status(404).json({ error: 'App not found' });
                    return;
                }
                const apiKeys = yield this.apiKeyRepository.findApiKeysByAppId(appId);
                res.json({
                    success: true,
                    apiKeys: apiKeys.map(key => ({
                        key: key.key,
                        isActive: key.isActive,
                        expiresAt: key.expiresAt,
                        createdAt: key.createdAt
                    }))
                });
            }
            catch (error) {
                console.error('Get API key error:', error);
                res.status(500).json({ error: 'Failed to retrieve API keys' });
            }
        });
        // Revoke API key
        this.revokeApiKey = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { keyId, userId } = req.body;
                if (!keyId || !userId) {
                    res.status(400).json({ error: 'keyId and userId are required' });
                    return;
                }
                const revokedKey = yield this.apiKeyRepository.revokeApiKey(keyId);
                if (!revokedKey) {
                    res.status(404).json({ error: 'API key not found' });
                    return;
                }
                res.json({
                    success: true,
                    message: 'API key revoked successfully',
                    keyId: revokedKey._id
                });
            }
            catch (error) {
                console.error('Revoke API key error:', error);
                res.status(500).json({ error: 'Failed to revoke API key' });
            }
        });
        this.appRepository = new IApp_Repository_1.AppRepository();
        this.apiKeyRepository = new ApiKey_Repository_1.ApiKeyRepository();
    }
    generateApiKey() {
        return `sk_${crypto_1.default.randomBytes(32).toString('hex')}`;
    }
}
exports.AuthController = AuthController;
