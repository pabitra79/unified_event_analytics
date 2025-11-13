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
exports.AnalyticsController = void 0;
const Event_Repository_1 = require("../repository/Event.Repository");
const Redis_Repository_1 = require("../repository/Redis.Repository");
class AnalyticsController {
    constructor() {
        this.collectEvent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const app = req.app;
                const eventData = Object.assign(Object.assign({}, req.body), { appId: app._id, timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date() });
                // Save event using repository
                const event = yield this.eventRepository.createEvent(eventData);
                // Invalidate relevant cache
                yield this.invalidateEventCache(app._id, eventData.event);
                res.status(201).json({
                    success: true,
                    eventId: event._id,
                    message: 'Event collected successfully'
                });
            }
            catch (error) {
                console.error('Collect event error:', error);
                res.status(500).json({ error: 'Failed to collect event' });
            }
        });
        this.getEventSummary = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { event, startDate, endDate, app_id } = req.query;
                const app = req.app;
                const targetAppId = app_id || app._id;
                // Generate cache key
                const cacheKey = this.redisRepository.generateCacheKey('event_summary', {
                    appId: targetAppId,
                    event,
                    startDate,
                    endDate
                });
                const cachedData = yield this.redisRepository.get(cacheKey);
                if (cachedData) {
                    res.json(Object.assign(Object.assign({}, cachedData), { cached: true }));
                    return;
                }
                const result = yield this.eventRepository.getEventSummary(targetAppId, event, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
                const summary = result.length > 0 ? result[0] : {
                    event,
                    count: 0,
                    uniqueUsers: 0,
                    deviceData: { mobile: 0, desktop: 0, tablet: 0 }
                };
                const responseData = {
                    event,
                    count: summary.count || 0,
                    uniqueUsers: summary.uniqueUsers || 0,
                    deviceData: summary.deviceData || { mobile: 0, desktop: 0, tablet: 0 }
                };
                // Cache the result for 5 minutes
                yield this.redisRepository.set(cacheKey, responseData, 300);
                res.json(responseData);
            }
            catch (error) {
                console.error('Get event summary error:', error);
                res.status(500).json({ error: 'Failed to get event summary' });
            }
        });
        // Get user statistics
        this.getUserStats = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, app_id } = req.query;
                const app = req.app;
                // Use provided app_id or default to authenticated app
                const targetAppId = app_id || app._id;
                // Generate cache key
                const cacheKey = this.redisRepository.generateCacheKey('user_stats', {
                    appId: targetAppId,
                    userId
                });
                // Try to get from cache first
                const cachedData = yield this.redisRepository.get(cacheKey);
                if (cachedData) {
                    res.json(Object.assign(Object.assign({}, cachedData), { cached: true }));
                    return;
                }
                // Get data from database
                const result = yield this.eventRepository.getUserStats(userId, targetAppId);
                const userStats = result.length > 0 ? result[0] : {
                    userId,
                    totalEvents: 0,
                    deviceDetails: { browser: '', os: '' },
                    ipAddress: ''
                };
                const responseData = {
                    userId: userStats.userId || userId,
                    totalEvents: userStats.totalEvents || 0,
                    deviceDetails: userStats.deviceDetails || { browser: '', os: '' },
                    ipAddress: userStats.ipAddress || ''
                };
                // Cache the result for 2 minutes
                yield this.redisRepository.set(cacheKey, responseData, 120); //sec in measure
                res.json(responseData);
            }
            catch (error) {
                console.error('Get user stats error:', error);
                res.status(500).json({ error: 'Failed to get user statistics' });
            }
        });
        this.eventRepository = new Event_Repository_1.EventRepository();
        this.redisRepository = new Redis_Repository_1.RedisRepository();
    }
    // Invalidate cache when new events are added
    invalidateEventCache(appId, eventType) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachePatterns = [
                `event_summary:appId=${appId}*`,
                `user_stats:appId=${appId}*`
            ];
            for (const pattern of cachePatterns) {
                try {
                    console.log(`Cache invalidated for pattern: ${pattern}`);
                }
                catch (error) {
                    console.error('Cache invalidation error:', error);
                }
            }
        });
    }
}
exports.AnalyticsController = AnalyticsController;
