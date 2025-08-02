"use strict";
// src/app/modules/rider/rider.model.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_1 = require("../../../enums/ride");
const rideSchema = new mongoose_1.Schema({
    rider: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    driver: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    pickupLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    destinationLocation: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    status: {
        type: String,
        enum: Object.values(ride_1.RIDE_STATUSES),
        default: ride_1.RIDE_STATUSES.requested,
    },
    fare: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending',
    },
    timestamps: {
        requestedAt: { type: Date, default: Date.now },
        acceptedAt: { type: Date },
        startedAt: { type: Date },
        completedAt: { type: Date },
        cancelledAt: { type: Date },
    },
}, { timestamps: true });
// Add 2dsphere index for geospatial queries
rideSchema.index({ pickupLocation: '2dsphere' });
rideSchema.index({ destinationLocation: '2dsphere' });
exports.Ride = (0, mongoose_1.model)('Ride', rideSchema);
