// src/app/modules/rider/rider.interface.ts

export interface ICoordinate {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IRide {
  _id: string;
  rider: string;
  driver?: string;
  pickupLocation: ICoordinate;
  destinationLocation: ICoordinate;
  fare?: number;
  status: 'requested' | 'accepted' | 'picked_up' | 'in_transit' | 'completed' | 'cancelled';
  timestamps?: {
    requestedAt?: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    inTransitAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };
  distance?: number;
}
