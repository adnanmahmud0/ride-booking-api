import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const calculateDistance = async (origin: string, destination: string): Promise<number> => {
  try {
    // Parse coordinates (expected format: "lng,lat")
    const [originLng, originLat] = origin.split(',').map(Number);
    const [destLng, destLat] = destination.split(',').map(Number);

    if (isNaN(originLng) || isNaN(originLat) || isNaN(destLng) || isNaN(destLat)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid coordinate format. Use "lng,lat" (e.g., "-74.0060,40.7128")');
    }

    // Earth's radius in kilometers
    const R = 6371;

    // Convert latitude and longitude to radians
    const lat1 = (originLat * Math.PI) / 180;
    const lat2 = (destLat * Math.PI) / 180;
    const deltaLat = ((destLat - originLat) * Math.PI) / 180;
    const deltaLng = ((destLng - originLng) * Math.PI) / 180;

    // Haversine formula
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to calculate distance');
  }
};

export const GeoUtils = {
  calculateDistance,
};