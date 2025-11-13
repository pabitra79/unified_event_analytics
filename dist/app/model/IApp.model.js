"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const mongoose_1 = require("mongoose");
const AppSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    websiteUrl: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
exports.App = (0, mongoose_1.model)('App', AppSchema);
