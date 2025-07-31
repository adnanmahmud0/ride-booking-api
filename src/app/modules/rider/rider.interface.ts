import { Model, Types } from 'mongoose';

export type IRide = {
  rider: Types.ObjectId;
  driver: Types.ObjectId | null;
  pickupLocation: { type: string; coordinates: [number, number] };
  destinationLocation: { type: string; coordinates: [number, number] };
  status: 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'completed' | 'canceled';
  cancelReason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RideModal = {
  isRideExist(id: string): Promise<IRide | null>;
} & Model<IRide>;