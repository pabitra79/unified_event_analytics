"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKey = void 0;
const mongoose_1 = require("mongoose");
const ApiKeySchema = new mongoose_1.Schema({
    key: { type: String, required: true, unique: true },
    appId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'App', required: true },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.ApiKey = (0, mongoose_1.model)('ApiKey', ApiKeySchema);
