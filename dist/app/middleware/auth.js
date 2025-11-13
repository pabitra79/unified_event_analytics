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
exports.authenticateApiKey = void 0;
const IApiKey_model_1 = require("../model/IApiKey.model");
const authenticateApiKey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiKey = req.headers['x-api-key'];
        if (!apiKey) {
            res.status(401).json({ error: 'API key is required in x-api-key header' });
            return;
        }
        const keyData = yield IApiKey_model_1.ApiKey.aggregate([
            {
                $match: {
                    key: apiKey,
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
        if (keyData.length === 0) {
            res.status(401).json({ error: 'Invalid or expired API key' });
            return;
        }
        req.app = keyData[0].app;
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.authenticateApiKey = authenticateApiKey;
