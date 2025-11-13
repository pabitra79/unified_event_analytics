import { Event } from "../model/Event.model";
import { IEvent } from "../interface/IAnalytics.interface";

export class EventRepository {
    async createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
        const event = new Event(eventData);
        return await event.save();
    }

    async getEventSummary(appId: string, eventType: string, startDate?: Date, endDate?: Date): Promise<any> {
        const matchStage: any = {
            appId: appId,
            event: eventType
        };

        if (startDate || endDate) {
            matchStage.timestamp = {};
            if (startDate) matchStage.timestamp.$gte = new Date(startDate);
            if (endDate) matchStage.timestamp.$lte = new Date(endDate);
        }

        return await Event.aggregate([
            {
                $match: matchStage
            },
            {
                $group: {
                    _id: '$device',
                    count: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$userId' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCount: { $sum: '$count' },
                    deviceData: {
                        $push: {
                            device: '$_id',
                            count: '$count'
                        }
                    },
                    uniqueUsers: { $first: '$uniqueUsers' }
                }
            },
            {
                $project: {
                    _id: 0,
                    count: '$totalCount',
                    uniqueUsers: { $size: { $setUnion: '$uniqueUsers' } },
                    deviceData: {
                        $arrayToObject: {
                            $map: {
                                input: '$deviceData',
                                as: 'device',
                                in: {
                                    k: '$$device.device',
                                    v: '$$device.count'
                                }
                            }
                        }
                    }
                }
            }
        ]);
    }

    async getUserStats(userId: string, appId?: string): Promise<any> {
        const matchStage: any = { userId };
        if (appId) matchStage.appId = appId;

        return await Event.aggregate([
            {
                $match: matchStage
            },
            {
                $group: {
                    _id: '$userId',
                    totalEvents: { $sum: 1 },
                    devices: { $addToSet: '$metadata' },
                    ipAddresses: { $addToSet: '$ipAddress' },
                    lastActive: { $max: '$timestamp' }
                }
            },
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    totalEvents: 1,
                    deviceDetails: {
                        browser: { $arrayElemAt: ['$devices.browser', 0] },
                        os: { $arrayElemAt: ['$devices.os', 0] }
                    },
                    ipAddress: { $arrayElemAt: ['$ipAddresses', 0] },
                    lastActive: 1
                }
            }
        ]);
    }
}