import { Schema, model, Types } from 'mongoose';
import { IRide, IRideStatus } from './rider.interface';

const RideSchema = new Schema<IRide>({
  _id: { type: String, required: true },
  rider: { type: String, required: true },
  driver: { type: String },
  pickupAddress: { type: String, required: true },
  destinationAddress: { type: String, required: true },
  pickupLocation: {
    type: { type: String, enum: ['Point'], default: 'Point', required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  destinationLocation: {
    type: { type: String, enum: ['Point'], default: 'Point', required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  fare: { type: Number },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'picked_up', 'in_transit', 'completed', 'cancelled'],
    default: 'requested',
  },
  timestamps: {
    requestedAt: { type: Date },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    inTransitAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
  },
});

// Add geospatial index for proximity queries
RideSchema.index({ pickupLocation: '2dsphere', destinationLocation: '2dsphere' });

export const Ride = model<IRide>('Ride', RideSchema);