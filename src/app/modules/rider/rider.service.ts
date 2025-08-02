import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { Ride } from './rider.model';
import { RIDE_STATUSES } from '../../../enums/ride';
import { USER_ROLES } from '../../../enums/user';
import { SystemSettings } from '../systemSettings/systemSettings.model';

const parseCoordinates = (location: string): [number, number] => {
  const [longitude, latitude] = location.split(',').map(coord => parseFloat(coord.trim()));
  if (isNaN(longitude) || isNaN(latitude)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid coordinate format');
  }
  return [longitude, latitude];
};

const calculateDistance = (pickup: [number, number], destination: [number, number]): number => {
  const [lon1, lat1] = pickup;
  const [lon2, lat2] = destination;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const requestRide = async (
  user: JwtPayload,
  payload: { pickupLocation: string; destinationLocation: string }
) => {
  if (user.role !== USER_ROLES.rider) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only riders can request rides');
  }

  const settings = await SystemSettings.findOne();
  if (!settings) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'System settings not found');
  }

  const pickupCoords = parseCoordinates(payload.pickupLocation);
  const destinationCoords = parseCoordinates(payload.destinationLocation);
  const distance = calculateDistance(pickupCoords, destinationCoords);
  const fare = distance * settings.farePerKm;

  const rideData = {
    rider: user.id,
    pickupLocation: {
      type: 'Point',
      coordinates: pickupCoords,
    },
    destinationLocation: {
      type: 'Point',
      coordinates: destinationCoords,
    },
    fare,
    status: RIDE_STATUSES.requested,
  };

  const ride = await Ride.create(rideData);
  return ride;
};

const cancelRide = async (user: JwtPayload, rideId: string) => {
  if (user.role !== USER_ROLES.rider) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only riders can cancel rides');
  }
  const ride = await Ride.findById(rideId);
  if (!ride || ride.rider.toString() !== user.id) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Ride not found or not owned by this rider');
  }
  if (ride.status !== RIDE_STATUSES.requested && ride.status !== RIDE_STATUSES.accepted) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Ride cannot be cancelled in this status');
  }
  const settings = await SystemSettings.findOne();
  if (!settings) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'System settings not found');
  }
  if (ride.timestamps.requestedAt && (Date.now() - ride.timestamps.requestedAt.getTime()) > settings.cancellationWindowMinutes * 60000) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Cancellation window has expired');
  }
  ride.status = RIDE_STATUSES.cancelled;
  ride.timestamps.cancelledAt = new Date();
  await ride.save();
  return ride;
};

const getRiderRides = async (user: JwtPayload) => {
  if (user.role !== USER_ROLES.rider) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only riders can view their rides');
  }
  const rides = await Ride.find({ rider: user.id }).populate('rider driver');
  return rides;
};

const payForRide = async (user: JwtPayload, rideId: string, payload: { paymentMethod: string }) => {
  if (user.role !== USER_ROLES.rider) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only riders can make payments');
  }
  const ride = await Ride.findById(rideId);
  if (!ride || ride.rider.toString() !== user.id) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Ride not found or not owned by this rider');
  }
  if (ride.status !== RIDE_STATUSES.completed) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Ride must be completed before payment');
  }
  if (ride.paymentStatus === 'completed') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Ride already paid');
  }
  ride.paymentStatus = 'completed';
  await ride.save();
  return ride;
};

const getAllRides = async () => {
  const rides = await Ride.find({}).populate('rider driver');
  return rides;
};

export const RiderService = {
  requestRide,
  cancelRide,
  getRiderRides,
  payForRide,
  getAllRides,
};