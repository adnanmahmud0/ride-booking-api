import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { Server } from 'socket.io';
import ApiError from '../../../errors/ApiError';

import { ICar, IDriverInfo } from './driver.interface';
import { Driver } from './driver.model';
import { Ride } from '../rider/rider.model';

// Declare global io (set in server.ts)
declare global {
  var io: Server;
}

// Create driver profile
const createDriverProfile = async (user: JwtPayload, payload: { car: ICar; driverInfo: IDriverInfo }) => {
  const existingDriver = await Driver.findOne({ user: user.id });
  if (existingDriver) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Driver profile already exists');
  }

  const driver = await Driver.create({
    user: user.id,
    car: payload.car,
    driverInfo: payload.driverInfo,
    isApproved: false,
    availability: 'offline',
  });

  return driver;
};

// Update driver profile
const updateDriverProfile = async (user: JwtPayload, payload: { car?: Partial<ICar>; driverInfo?: Partial<IDriverInfo> }) => {
  const driver = await Driver.findOne({ user: user.id });
  if (!driver) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Driver profile not found');
  }

  if (payload.car) {
    driver.car = { ...driver.car, ...payload.car };
  }
  if (payload.driverInfo) {
    driver.driverInfo = { ...driver.driverInfo, ...payload.driverInfo };
  }

  await driver.save();
  return driver;
};

// Set driver availability
const setAvailability = async (user: JwtPayload, payload: { availability: 'online' | 'offline' }) => {
  const driver = await Driver.findOne({ user: user.id });
  if (!driver) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Driver profile not found');
  }

  driver.availability = payload.availability;
  await driver.save();

  // Emit availability update to Socket.IO
  global.io.emit('updateAvailability', {
    userId: user.id,
    availability: payload.availability,
  });

  return driver;
};

// Get driver profile
const getMyDriverProfile = async (user: JwtPayload) => {
  const driver = await Driver.findOne({ user: user.id }).populate('user');
  if (!driver) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Driver profile not found');
  }
  return driver;
};

// Get driver earnings
const getEarnings = async (user: JwtPayload) => {
  const driver = await Driver.findOne({ user: user.id });
  if (!driver) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Driver profile not found');
  }

  const rides = await Ride.find({ driver: user.id, status: 'completed' });
  const totalEarnings = rides.reduce((sum, ride) => sum + (ride.fare || 0), 0);

  return { totalEarnings, rides };
};

// Approve driver (admin)
const approveDriver = async (driverId: string) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Driver not found');
  }

  driver.isApproved = true;
  await driver.save();
  return driver;
};

// Suspend driver (admin)
const suspendDriver = async (driverId: string) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Driver not found');
  }

  driver.isApproved = false;
  driver.availability = 'offline';
  await driver.save();
  return driver;
};

export const DriverService = {
  createDriverProfile,
  updateDriverProfile,
  setAvailability,
  getMyDriverProfile,
  getEarnings,
  approveDriver,
  suspendDriver,
};