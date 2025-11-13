"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const swaggerOptions = require('./swagger.json');
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
const dbConfig_1 = require("./app/config/dbConfig");
const redisConfig_1 = require("./app/config/redisConfig");
require("./app/config/googleOAuth");
// Connect to databases
(0, dbConfig_1.connectionDb)();
(0, redisConfig_1.connectRedis)();
const auth_1 = require("./app/router/auth");
const analytics_1 = require("./app/router/analytics");
app.use("/api/auth", auth_1.Authrouter);
app.use("/api/analytics", analytics_1.Analyticsrouter);
// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Unified Event Analytics Engine is running",
        timestamp: new Date().toISOString()
    });
});
app.get("/", (req, res) => {
    res.json({
        message: "Unified Event Analytics Engine API",
        version: "1.0.0",
        documentation: "/api-docs"
    });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(" Server running on port 5000");
    console.log(" Swagger docs at http://localhost:5000/api-docs");
    console.log("  Health check at http://localhost:5000/health");
});
