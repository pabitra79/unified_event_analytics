"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analyticsrouter = void 0;
const express_1 = require("express");
const AnalyticsController_1 = require("../controller/AnalyticsController");
const auth_1 = require("../middleware/auth");
const rateLimit_1 = require("../middleware/rateLimit");
const validation_1 = require("../middleware/validation");
const Analyticsrouter = (0, express_1.Router)();
exports.Analyticsrouter = Analyticsrouter;
const analyticsController = new AnalyticsController_1.AnalyticsController();
/**
 * @swagger
 * /api/analytics/collect:
 *   post:
 *     summary: Collect analytics event
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event
 *               - url
 *               - device
 *               - ipAddress
 *             properties:
 *               event:
 *                 type: string
 *                 example: "login_form_cta_click"
 *               url:
 *                 type: string
 *                 example: "https://example.com/page"
 *               referrer:
 *                 type: string
 *                 example: "https://google.com"
 *               device:
 *                 type: string
 *                 enum: [mobile, desktop, tablet]
 *                 example: "mobile"
 *               ipAddress:
 *                 type: string
 *                 example: "192.168.1.1"
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-02-20T12:34:56Z"
 *               metadata:
 *                 type: object
 *                 properties:
 *                   browser:
 *                     type: string
 *                     example: "Chrome"
 *                   os:
 *                     type: string
 *                     example: "Android"
 *                   screenSize:
 *                     type: string
 *                     example: "1080x1920"
 *               userId:
 *                 type: string
 *                 example: "user789"
 *     responses:
 *       201:
 *         description: Event collected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 eventId:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - Invalid API key
 */
Analyticsrouter.post('/collect', auth_1.authenticateApiKey, rateLimit_1.eventRateLimit, validation_1.validateEvent, analyticsController.collectEvent);
/**
 * @swagger
 * /api/analytics/event-summary:
 *   get:
 *     summary: Get event summary analytics
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: event
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: app_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: string
 *                 count:
 *                   type: number
 *                 uniqueUsers:
 *                   type: number
 *                 deviceData:
 *                   type: object
 *                   properties:
 *                     mobile:
 *                       type: number
 *                     desktop:
 *                       type: number
 *                     tablet:
 *                       type: number
 *                 cached:
 *                   type: boolean
 *                   description: Indicates if data was served from cache
 */
Analyticsrouter.get('/event-summary', auth_1.authenticateApiKey, rateLimit_1.analyticsRateLimit, validation_1.validateEventSummary, analyticsController.getEventSummary);
/**
 * @swagger
 * /api/analytics/user-stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Analytics]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: app_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 totalEvents:
 *                   type: number
 *                 deviceDetails:
 *                   type: object
 *                   properties:
 *                     browser:
 *                       type: string
 *                     os:
 *                       type: string
 *                 ipAddress:
 *                   type: string
 *                 cached:
 *                   type: boolean
 *                   description: Indicates if data was served from cache
 */
Analyticsrouter.get('/user-stats', auth_1.authenticateApiKey, rateLimit_1.analyticsRateLimit, validation_1.validateUserStats, analyticsController.getUserStats);
