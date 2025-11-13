import { Request, Response } from 'express';
import crypto from 'crypto';
import { Types } from 'mongoose';
import { AppRepository } from '../repository/IApp.Repository';
import { ApiKeyRepository } from '../repository/ApiKey.Repository';

export class AuthController {
    private appRepository: AppRepository;
    private apiKeyRepository: ApiKeyRepository;

    constructor() {
        this.appRepository = new AppRepository();
        this.apiKeyRepository = new ApiKeyRepository();
    }

    private generateApiKey(): string {
        return `sk_${crypto.randomBytes(32).toString('hex')}`;
    }

    // Handle Google OAuth callback
    public handleGoogleCallback = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = (req as any).user;
            
            res.json({
                success: true,
                message: 'Google authentication successful',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        } catch (error) {
            console.error('Google callback error:', error);
            res.status(500).json({ error: 'Authentication failed' });
        }
    };

    // Register new app
    public registerApp = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, websiteUrl, userEmail } = req.body;

            const userId = crypto.randomBytes(16).toString('hex');
            const app = await this.appRepository.createApp({
                name,
                websiteUrl,
                userId,
                userEmail
            });

            const apiKey = await this.apiKeyRepository.createApiKey({
                key: this.generateApiKey(),
                appId: app._id as Types.ObjectId,
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1year 
            });

            res.status(201).json({
                success: true,
                appId: app._id,
                apiKey: apiKey.key,
                expiresAt: apiKey.expiresAt,
                message: 'App registered successfully'
            });
        } catch (error) {
            console.error('Register app error:', error);
            res.status(500).json({ error: 'Failed to register application' });
        }
    };

    public getApiKey = async (req: Request, res: Response): Promise<void> => {
        try {
            const { appId, userId } = req.query;

            if (!appId || !userId) {
                res.status(400).json({ error: 'appId and userId are required' });
                return;
            }

            
            const app = await this.appRepository.findAppByUserAndId(userId as string, appId as string);
            if (!app) {
                res.status(404).json({ error: 'App not found' });
                return;
            }

            const apiKeys = await this.apiKeyRepository.findApiKeysByAppId(appId as string);

            res.json({
                success: true,
                apiKeys: apiKeys.map(key => ({
                    key: key.key,
                    isActive: key.isActive,
                    expiresAt: key.expiresAt,
                    createdAt: key.createdAt
                }))
            });
        } catch (error) {
            console.error('Get API key error:', error);
            res.status(500).json({ error: 'Failed to retrieve API keys' });
        }
    };

    // Revoke API key
    public revokeApiKey = async (req: Request, res: Response): Promise<void> => {
        try {
            const { keyId, userId } = req.body;

            if (!keyId || !userId) {
                res.status(400).json({ error: 'keyId and userId are required' });
                return;
            }

            const revokedKey = await this.apiKeyRepository.revokeApiKey(keyId);
            if (!revokedKey) {
                res.status(404).json({ error: 'API key not found' });
                return;
            }

            res.json({
                success: true,
                message: 'API key revoked successfully',
                keyId: revokedKey._id
            });
        } catch (error) {
            console.error('Revoke API key error:', error);
            res.status(500).json({ error: 'Failed to revoke API key' });
        }
    };
}