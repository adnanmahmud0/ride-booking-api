import { Schema, model } from 'mongoose';
import { IRide, RideModal } from './rider.interface';

const rideSchema = new Schema<IRide, RideModal>(
  {
    rider: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driver: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    pickupLocation: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    destinationLocation: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    status: {
      type: String,
      enum: ['requested', 'accepted', 'picked_up', 'in_transit', 'completed', 'canceled'],
      default: 'requested',
    },
    cancelReason: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create geospatial index for location-based queries
rideSchema.index({ pickupLocation: '2dsphere' });

// Add static method
rideSchema.statics.isRideExist = async function (id: string): Promise<IRide | null> {
  return await Ride.findById(id);
};

export const Ride = model<IRide, RideModal>('Ride', rideSchema);