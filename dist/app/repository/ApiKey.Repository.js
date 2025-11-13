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
exports.ApiKeyRepository = void 0;
const IApiKey_model_1 = require("../model/IApiKey.model");
class ApiKeyRepository {
    createApiKey(apiKeyData) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = new IApiKey_model_1.ApiKey(apiKeyData);
            return yield apiKey.save();
        });
    }
    findApiKeyByKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield IApiKey_model_1.ApiKey.aggregate([
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
        });
    }
    findApiKeysByAppId(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield IApiKey_model_1.ApiKey.find({ appId, isActive: true }).sort({ createdAt: -1 });
        });
    }
    revokeApiKey(keyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield IApiKey_model_1.ApiKey.findByIdAndUpdate(keyId, { isActive: false }, { new: true });
        });
    }
    isValidApiKey(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = yield IApiKey_model_1.ApiKey.findOne({
                key,
                isActive: true,
                expiresAt: { $gt: new Date() }
            });
            return !!apiKey;
        });
    }
}
exports.ApiKeyRepository = ApiKeyRepository;
