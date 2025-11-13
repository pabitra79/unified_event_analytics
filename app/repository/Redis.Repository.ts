import { getRedisClient } from '../config/redisConfig';

export class RedisRepository {
    private redis = getRedisClient();


    async set(key: string, data: any, expiresIn: number = 300): Promise<void> {
        try {
            await this.redis.setex(key, expiresIn, JSON.stringify(data));
        } catch (error) {
            console.error('Redis set error:', error);
        }
    }


    async get(key: string): Promise<any> {
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await this.redis.del(key);
        } catch (error) {
            console.error('Redis delete error:', error);
        }
    }


    generateCacheKey(prefix: string, params: any): string {
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return `${prefix}:${sortedParams}`;
    }


    async isConnected(): Promise<boolean> {
        try {
            await this.redis.ping();
            return true;
        } catch (error) {
            return false;
        }
    }
}