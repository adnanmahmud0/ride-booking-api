"use strict";
// driver.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driverSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    car: {
        make: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: Number, required: true },
        licensePlate: { type: String, required: true },
    },
    driverInfo: {
        licenseNumber: { type: String, required: true },
        licenseImage: { type: String },
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    availability: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline',
    },
}, { timestamps: true });
exports.Driver = (0, mongoose_1.model)('Driver', driverSchema);
