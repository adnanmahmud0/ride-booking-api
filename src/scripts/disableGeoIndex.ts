// scripts/disableGeoIndex.ts

import { Ride } from "../app/modules/rider/rider.model";


export const disableGeoIndex = async () => {
  try {
    await Ride.collection.dropIndex('pickupLocation_2dsphere');
    await Ride.collection.dropIndex('destinationLocation_2dsphere');
    console.log('Geospatial indexes dropped');
  } catch (error) {
    console.log('No geospatial indexes to drop:', error);
  }
};