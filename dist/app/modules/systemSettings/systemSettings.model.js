"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemSettings = void 0;
const mongoose_1 = require("mongoose");
const systemSettingsSchema = new mongoose_1.Schema({
    farePerKm: {
        type: Number,
        default: 2.5, // Default $2.5 per km
        min: 0,
    },
    cancellationWindowMinutes: {
        type: Number,
        default: 5, // Default 5 minutes for cancellation
        min: 0,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
exports.SystemSettings = (0, mongoose_1.model)('SystemSettings', systemSettingsSchema);
