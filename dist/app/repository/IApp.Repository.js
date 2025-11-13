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
exports.AppRepository = void 0;
const IApp_model_1 = require("../model/IApp.model");
class AppRepository {
    createApp(appData) {
        return __awaiter(this, void 0, void 0, function* () {
            const app = new IApp_model_1.App(appData);
            return yield app.save();
        });
    }
    findAppById(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield IApp_model_1.App.findById(appId);
        });
    }
    findAppsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield IApp_model_1.App.find({ userId }).sort({ createdAt: -1 });
        });
    }
    findAppByUserAndId(userId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield IApp_model_1.App.findOne({ _id: appId, userId });
        });
    }
}
exports.AppRepository = AppRepository;
