// src/app/modules/rider/rider.model.ts

import { Schema, model } from 'mongoose';
import { RIDE_STATUSES } from '../../../enums/ride';

interface IGeoJSON {
  type: 'Point';
  coordinates: [number, number];
}

interface IRide {
  rider: Schema.Types.ObjectId;
  driver?: Schema.Types.ObjectId;
  pickupLocation: IGeoJSON;
  destinationLocation: IGeoJSON;
  status: string;
  fare: number;
  paymentStatus: 'pending' | 'completed';
  timestamps: {
    requestedAt: Date;
    acceptedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };
}

const rideSchema = new Schema<IRide>(
  {
    rider: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driver: {
      type: Schema.Types.ObjectId,
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
      enum: Object.values(RIDE_STATUSES),
      default: RIDE_STATUSES.requested,
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
  },
  { timestamps: true }
);

// Add 2dsphere index for geospatial queries
rideSchema.index({ pickupLocation: '2dsphere' });
rideSchema.index({ destinationLocation: '2dsphere' });

export const Ride = model<IRide>('Ride', rideSchema);
