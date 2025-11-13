import { Schema, model } from "mongoose";
import { IApp } from "../interface/IApp.interface";

const AppSchema: Schema = new Schema({
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

export const App = model<IApp>('App', AppSchema);