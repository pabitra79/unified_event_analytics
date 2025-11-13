import { App } from "../model/IApp.model";
import { IApp } from "../interface/IApp.interface";

export class AppRepository {
    async createApp(appData: Partial<IApp>): Promise<IApp> {
        const app = new App(appData);
        return await app.save();
    }

    async findAppById(appId: string): Promise<IApp | null> {
        return await App.findById(appId);
    }

    async findAppsByUserId(userId: string): Promise<IApp[]> {
        return await App.find({ userId }).sort({ createdAt: -1 });
    }

    async findAppByUserAndId(userId: string, appId: string): Promise<IApp | null> {
        return await App.findOne({ _id: appId, userId });
    }
}