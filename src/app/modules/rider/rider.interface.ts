// rider.interface.ts

import { Types } from 'mongoose';

export interface ICoordinate {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}


export type IRideStatus =
  | 'requested'
  | 'accepted'
  | 'picked_up'
  | 'in_transit'
  | 'completed'
  | 'cancelled';

export interface IRide {
  _id: string;
  rider: string;
  driver?: Types.ObjectId | string;
  pickupAddress: string;
  destinationAddress: string;
  pickupLocation: ICoordinate;
  destinationLocation: ICoordinate;
  fare?: number;
  status: IRideStatus;
  timestamps?: {
    requestedAt?: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    inTransitAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };
  distance?: number; // in kilometers
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}