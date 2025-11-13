"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAppSchema = exports.userStatsSchema = exports.eventSummarySchema = exports.eventSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.eventSchema = joi_1.default.object({
    event: joi_1.default.string().required().min(1).max(100),
    url: joi_1.default.string().uri().required(),
    referrer: joi_1.default.string().uri().allow(''),
    device: joi_1.default.string().valid('mobile', 'desktop', 'tablet').required(),
    ipAddress: joi_1.default.string().ip().required(),
    timestamp: joi_1.default.date().iso().max('now'),
    metadata: joi_1.default.object({
        browser: joi_1.default.string().max(50),
        os: joi_1.default.string().max(50),
        screenSize: joi_1.default.string().max(20)
    }).optional(),
    userId: joi_1.default.string().max(100).optional()
});
exports.eventSummarySchema = joi_1.default.object({
    event: joi_1.default.string().required(),
    startDate: joi_1.default.date().iso().optional(),
    endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate')).optional(),
    app_id: joi_1.default.string().optional()
});
exports.userStatsSchema = joi_1.default.object({
    userId: joi_1.default.string().required(),
    app_id: joi_1.default.string().optional()
});
exports.registerAppSchema = joi_1.default.object({
    name: joi_1.default.string().required().min(1).max(100),
    websiteUrl: joi_1.default.string().uri().required(),
    userEmail: joi_1.default.string().email().required()
});
