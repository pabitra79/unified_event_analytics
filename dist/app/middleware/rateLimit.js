"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRateLimit = exports.eventRateLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Rate limiting for event collection
exports.eventRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: {
        error: 'Too many events submitted from this IP, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.ip || req.socket.remoteAddress || 'unknown';
    }
});
exports.analyticsRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 60,
    message: {
        error: 'Too many analytics requests, please try again after a minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.ip || req.socket.remoteAddress || 'unknown';
    }
});
