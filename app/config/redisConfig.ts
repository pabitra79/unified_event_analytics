import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

let redisClient: Redis;

export const connectRedis = async (): Promise<void> => {
  try {
    redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

    redisClient.on("connect", () => {
      console.log(" Redis connected");
    });

    redisClient.on("error", (err: any) => {
      console.error(" Redis connection error:", err);
    });
  } catch (err) {
    console.error(" Redis is not connected:", err);
    process.exit(1);
  }
};

export const getRedisClient = (): Redis => {
  if (!redisClient) {
    throw new Error("Redis client not initialized. Call connectRedis() first.");
  }
  return redisClient;
};