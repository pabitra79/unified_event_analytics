import { ApiKey } from "../model/IApiKey.model";
import { IApiKey } from "../interface/IApiKey.interface";
import { Types } from 'mongoose';

export class ApiKeyRepository {
    async createApiKey(apiKeyData: Partial<IApiKey>): Promise<IApiKey> {
        const apiKey = new ApiKey(apiKeyData);
        return await apiKey.save();
    }

    async findApiKeyByKey(key: string): Promise<any> {
        return await ApiKey.aggregate([
            {
                $match: { 
                    key, 
                    isActive: true, 
                    expiresAt: { $gt: new Date() } 
                }
            },
            {
                $lookup: {
                    from: 'apps',
                    localField: 'appId',
                    foreignField: '_id',
                    as: 'app'
                }
            },
            {
                $unwind: '$app'
            },
            {
                $limit: 1
            }
        ]);
    }

    async findApiKeysByAppId(appId: string): Promise<IApiKey[]> {
        return await ApiKey.find({ appId, isActive: true }).sort({ createdAt: -1 });
    }

    async revokeApiKey(keyId: string): Promise<IApiKey | null> {
        return await ApiKey.findByIdAndUpdate(
            keyId,
            { isActive: false },
            { new: true }
        );
    }

    async isValidApiKey(key: string): Promise<boolean> {
        const apiKey = await ApiKey.findOne({
            key,
            isActive: true,
            expiresAt: { $gt: new Date() }
        });
        return !!apiKey;
    }
}