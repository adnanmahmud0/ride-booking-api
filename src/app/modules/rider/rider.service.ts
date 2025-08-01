import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { JwtPayload } from 'jsonwebtoken';
import { Server } from 'socket.io';
import { Ride } from './rider.model';
import { Types } from 'mongoose';
import { IRideStatus, IRide, PaginationQuery } from './rider.interface';
import { Driver } from '../driver/driver.model';

// Declare global io (set in server.ts)
declare global {
  var io: Server;
}

// Define valid status transitions
const validTransitions: Record<IRideStatus, IRideStatus[]> = {
  requested: ['accepted', 'cancelled'],
  accepted: ['picked_up', 'cancelled'],
  picked_up: ['in_transit'],
  in_transit: ['completed'],
  completed: [],
  cancelled: [],
};

// Rider requesting a ride
const requestRide = async (riderId: string, payload: any): Promise<IRide> => {
  const {
    pickupAddress,
    destinationAddress,
    pickupLocation,
    destinationLocation,
  } = payload;

  const ride = await Ride.create({
    rider: riderId,
    pickupAddress,
    destinationAddress,
    pickupLocation: { type: 'Point', coordinates: pickupLocation.coordinates },
    destinationLocation: { type: 'Point', coordinates: destinationLocation.coordinates },
    status: 'requested',
    timestamps: {
      requestedAt: new Date(),
    },
  });

  // Emit ride request to online drivers
  global.io.emit('rideRequest', { rideId: ride._id.toString(), riderId });

  return {
    ...ride.toObject(),
    _id: ride._id.toString(),
    rider: ride.rider.toString(),
    driver: ride.driver?.toString(),
  };
};

// Rider cancels a ride
const cancelRide = async (riderId: string, rideId: string): Promise<IRide> => {
  const ride = await Ride.findById(rideId);
  if (!ride) throw new ApiError(StatusCodes.NOT_FOUND, 'Ride not found');

  if (ride.rider.toString() !== riderId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to cancel this ride');
  }

  if (ride.status !== 'requested') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Ride can only be cancelled when in requested status');
  }

  ride.status = 'cancelled';
  ride.timestamps = ride.timestamps || {};
  ride.timestamps.cancelledAt = new Date();

  await ride.save();

  // Notify assigned driver (if any)
  if (ride.driver) {
    global.io.emit('rideCancelled', {
      rideId: ride._id.toString(),
      riderId,
      driverId: ride.driver.toString(),
    });
  }

  return {
    ...ride.toObject(),
    _id: ride._id.toString(),
    rider: ride.rider.toString(),
    driver: ride.driver?.toString(),
  };
};

// Driver accepts or rejects a ride
const acceptOrRejectRide = async (driverId: string, payload: { rideId: string; action: 'accept' | 'reject' }): Promise<IRide> => {
  const { rideId, action } = payload;

  const ride = await Ride.findById(rideId);
  if (!ride) throw new ApiError(StatusCodes.NOT_FOUND, 'Ride not found');

  if (ride.status !== 'requested') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Ride is no longer in requested status');
  }

  // Validate driver is online and approved
  const driver = await Driver.findOne({ user: driverId });
  if (!driver || driver.availability !== 'online' || !driver.isApproved) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Driver is not online or approved');
  }

  ride.timestamps = ride.timestamps || {};

  if (action === 'accept') {
    ride.status = 'accepted';
    ride.driver = new Types.ObjectId(driverId);
    ride.timestamps.acceptedAt = new Date();
  } else {
    ride.status = 'cancelled';
    ride.timestamps.cancelledAt = new Date();
  }

  await ride.save();

  // Notify rider
  global.io.emit('rideAction', {
    rideId: ride._id.toString(),
    driverId,
    riderId: ride.rider.toString(),
    action,
  });

  return {
    ...ride.toObject(),
    _id: ride._id.toString(),
    rider: ride.rider.toString(),
    driver: ride.driver?.toString(),
  };
};

// Driver updates ride status
const updateRideStatus = async (driverId: string, payload: { rideId: string; status: IRideStatus }): Promise<IRide> => {
  const { rideId, status } = payload;

  const ride = await Ride.findById(rideId);
  if (!ride) throw new ApiError(StatusCodes.NOT_FOUND, 'Ride not found');

  if (ride.driver?.toString() !== driverId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not assigned to this ride');
  }

  if (!validTransitions[ride.status].includes(status)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Cannot transition from ${ride.status} to ${status}`);
  }

  ride.status = status;
  ride.timestamps = ride.timestamps || {};

  if (status === 'picked_up') {
    ride.timestamps.pickedUpAt = new Date();
  }
  if (status === 'in_transit') {
    ride.timestamps.inTransitAt = new Date();
  }
  if (status === 'completed') {
    ride.timestamps.completedAt = new Date();
  }

  await ride.save();

  // Notify rider
  global.io.emit('rideStatusUpdate', {
    rideId: ride._id.toString(),
    riderId: ride.rider.toString(),
    status,
  });

  return {
    ...ride.toObject(),
    _id: ride._id.toString(),
    rider: ride.rider.toString(),
    driver: ride.driver?.toString(),
  };
};

// Get rides for a user (rider or driver)
const getUserRides = async (user: JwtPayload, query: PaginationQuery) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const filter = user.role === 'rider' ? { rider: user.id } : { driver: user.id };

  const rides = await Ride.find(filter)
    .populate('rider driver')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Ride.countDocuments(filter);

  const transformedRides = rides.map(ride => ({
    ...ride.toObject(),
    _id: ride._id.toString(),
    rider: ride.rider.toString(),
    driver: ride.driver?.toString(),
  }));

  return {
    rides: transformedRides,
    total,
    page,
    limit,
  };
};

// Admin get all rides
const getAllRides = async (): Promise<IRide[]> => {
  const rides = await Ride.find().populate('rider driver');
  return rides.map(ride => ({
    ...ride.toObject(),
    _id: ride._id.toString(),
    rider: ride.rider.toString(),
    driver: ride.driver?.toString(),
  }));
};

export const RideService = {
  requestRide,
  cancelRide,
  acceptOrRejectRide,
  updateRideStatus,
  getUserRides,
  getAllRides,
};