"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegisterApp = exports.validateUserStats = exports.validateEventSummary = exports.validateEvent = void 0;
const validationSchemas_1 = require("../helper/validationSchemas");
const validateEvent = (req, res, next) => {
    const { error } = validationSchemas_1.eventSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateEvent = validateEvent;
const validateEventSummary = (req, res, next) => {
    const { error } = validationSchemas_1.eventSummarySchema.validate(req.query);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateEventSummary = validateEventSummary;
const validateUserStats = (req, res, next) => {
    const { error } = validationSchemas_1.userStatsSchema.validate(req.query);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateUserStats = validateUserStats;
const validateRegisterApp = (req, res, next) => {
    const { error } = validationSchemas_1.registerAppSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    next();
};
exports.validateRegisterApp = validateRegisterApp;
