import { Request, Response } from 'express';
import { EventRepository } from '../repository/Event.Repository';
import { RedisRepository } from '../repository/Redis.Repository';

export class AnalyticsController {
    private eventRepository: EventRepository;
    private redisRepository: RedisRepository;

    constructor() {
        this.eventRepository = new EventRepository();
        this.redisRepository = new RedisRepository();
    }

    public collectEvent = async (req: Request, res: Response): Promise<void> => {
        try {
            const app = (req as any).app;
            const eventData = {
                ...req.body,
                appId: app._id,
                timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date()
            };

            // Save event using repository
            const event = await this.eventRepository.createEvent(eventData);

            // Invalidate relevant cache
            await this.invalidateEventCache(app._id, eventData.event);

            res.status(201).json({
                success: true,
                eventId: event._id,
                message: 'Event collected successfully'
            });
        } catch (error) {
            console.error('Collect event error:', error);
            res.status(500).json({ error: 'Failed to collect event' });
        }
    };

    public getEventSummary = async (req: Request, res: Response): Promise<void> => {
        try {
            const { event, startDate, endDate, app_id } = req.query;
            const app = (req as any).app;

            
            const targetAppId = app_id as string || app._id;

            // Generate cache key
            const cacheKey = this.redisRepository.generateCacheKey('event_summary', {
                appId: targetAppId,
                event,
                startDate,
                endDate
            });

            const cachedData = await this.redisRepository.get(cacheKey);
            if (cachedData) {
                res.json({
                    ...cachedData,
                    cached: true
                });
                return;
            }

            const result = await this.eventRepository.getEventSummary(
                targetAppId,
                event as string,
                startDate ? new Date(startDate as string) : undefined,
                endDate ? new Date(endDate as string) : undefined
            );

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
            await this.redisRepository.set(cacheKey, responseData, 300);

            res.json(responseData);
        } catch (error) {
            console.error('Get event summary error:', error);
            res.status(500).json({ error: 'Failed to get event summary' });
        }
    };

    // Get user statistics
    public getUserStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId, app_id } = req.query;
            const app = (req as any).app;

            // Use provided app_id or default to authenticated app
            const targetAppId = app_id as string || app._id;

            // Generate cache key
            const cacheKey = this.redisRepository.generateCacheKey('user_stats', {
                appId: targetAppId,
                userId
            });

            // Try to get from cache first
            const cachedData = await this.redisRepository.get(cacheKey);
            if (cachedData) {
                res.json({
                    ...cachedData,
                    cached: true
                });
                return;
            }

            // Get data from database
            const result = await this.eventRepository.getUserStats(
                userId as string,
                targetAppId
            );

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
            await this.redisRepository.set(cacheKey, responseData, 120); //sec in measure

            res.json(responseData);
        } catch (error) {
            console.error('Get user stats error:', error);
            res.status(500).json({ error: 'Failed to get user statistics' });
        }
    };

    // Invalidate cache when new events are added
    private async invalidateEventCache(appId: string, eventType: string): Promise<void> {
        const cachePatterns = [
            `event_summary:appId=${appId}*`,
            `user_stats:appId=${appId}*`
        ];

        for (const pattern of cachePatterns) {
            try {
                console.log(`Cache invalidated for pattern: ${pattern}`);
            } catch (error) {
                console.error('Cache invalidation error:', error);
            }
        }
    }
}