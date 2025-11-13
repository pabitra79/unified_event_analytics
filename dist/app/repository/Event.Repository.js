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
exports.EventRepository = void 0;
const Event_model_1 = require("../model/Event.model");
class EventRepository {
    createEvent(eventData) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = new Event_model_1.Event(eventData);
            return yield event.save();
        });
    }
    getEventSummary(appId, eventType, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchStage = {
                appId: appId,
                event: eventType
            };
            if (startDate || endDate) {
                matchStage.timestamp = {};
                if (startDate)
                    matchStage.timestamp.$gte = new Date(startDate);
                if (endDate)
                    matchStage.timestamp.$lte = new Date(endDate);
            }
            return yield Event_model_1.Event.aggregate([
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
        });
    }
    getUserStats(userId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const matchStage = { userId };
            if (appId)
                matchStage.appId = appId;
            return yield Event_model_1.Event.aggregate([
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
        });
    }
}
exports.EventRepository = EventRepository;
