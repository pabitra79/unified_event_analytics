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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisRepository = void 0;
const redisConfig_1 = require("../config/redisConfig");
class RedisRepository {
    constructor() {
        this.redis = (0, redisConfig_1.getRedisClient)();
    }
    set(key_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (key, data, expiresIn = 300) {
            try {
                yield this.redis.setex(key, expiresIn, JSON.stringify(data));
            }
            catch (error) {
                console.error('Redis set error:', error);
            }
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.redis.get(key);
                return data ? JSON.parse(data) : null;
            }
            catch (error) {
                console.error('Redis get error:', error);
                return null;
            }
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.del(key);
            }
            catch (error) {
                console.error('Redis delete error:', error);
            }
        });
    }
    generateCacheKey(prefix, params) {
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return `${prefix}:${sortedParams}`;
    }
    isConnected() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.redis.ping();
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.RedisRepository = RedisRepository;
