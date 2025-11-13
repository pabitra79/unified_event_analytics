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
exports.getRedisClient = exports.connectRedis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let redisClient;
const connectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        redisClient = new ioredis_1.default(process.env.REDIS_URL || "redis://localhost:6379");
        redisClient.on("connect", () => {
            console.log(" Redis connected");
        });
        redisClient.on("error", (err) => {
            console.error(" Redis connection error:", err);
        });
    }
    catch (err) {
        console.error(" Redis is not connected:", err);
        process.exit(1);
    }
});
exports.connectRedis = connectRedis;
const getRedisClient = () => {
    if (!redisClient) {
        throw new Error("Redis client not initialized. Call connectRedis() first.");
    }
    return redisClient;
};
exports.getRedisClient = getRedisClient;
