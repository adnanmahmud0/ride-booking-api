// driver.service.ts

import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { Driver } from './driver.model';
import { Ride } from '../rider/rider.model';
import { RIDE_STATUSES } from '../../../enums/ride';
import { USER_ROLES } from '../../../enums/user';
import { SystemSettings } from '../systemSettings/systemSettings.model';


const createDriverProfile = async (user: JwtPayload, payload: any) => {
  if (user.role !== USER_ROLES.driver) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only drivers can create a profile');
  }
  const existingProfile = await Driver.findOne({ userId: user.id });
  if (existingProfile) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Driver profile already exists');
  }
  const driver = await Driver.create({ userId: user.id, ...payload });
  return driver;
};

const getDriverProfile = async (user: JwtPayload, driverId?: string) => {
  if (user.role === USER_ROLES.driver && driverId && driverId !== user.id) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Drivers can only view their own profile');
  }
  const query = user.role === USER_ROLES.driver ? { userId: user.id } : { _id: driverId };
  if (!query._id && !query.userId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Driver ID required for admin access');
  }
  const driver = await Driver.findOne(query).populate('userId', 'name email contact location role');
  if (!driver) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Driver profile not found');
  }
  return driver;
};

const updateDriverProfile = async (user: JwtPayload, payload: any) => {
  if (user.role !== USER_ROLES.driver) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only drivers can update their profile');
  }
  const driver = await Driver.findOne({ userId: user.id });
  if (!driver) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Driver profile not found');
  }
  if (payload.licenseImage && driver.driverInfo.licenseImage) {
    unlinkFile(driver.driverInfo.licenseImage);
  }
  const updatedDriver = await Driver.findOneAndUpdate({ userId: user.id }, payload, { new: true });
  return updatedDriver;
};

const approveDriver = async (driverId: string) => {
  const driver = await Driver.findById(driverId);
  if (!driver) throw new ApiError(StatusCodes.NOT_FOUND, 'Driver not found');
  driver.isApproved = true;
  driver.availability = 'online';
  await driver.save();
  return driver;
};

const suspendDriver = async (driverId: string) => {
  const driver = await Driver.findById(driverId);
  if (!driver) throw new ApiError(StatusCodes.NOT_FOUND, 'Driver not found');
  driver.isApproved = false;
  driver.availability = 'offline';
  await driver.save();
  return driver;
};

const acceptRide = async (user: JwtPayload, rideId: string) => {
  if (user.role !== USER_ROLES.driver) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only drivers can accept rides');
  }
  const driver = await Driver.findOne({ userId: user.id });
  if (!driver || !driver.isApproved || driver.availability !== 'online') {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Driver not approved or offline');
  }
  const ride = await Ride.findById(rideId);
  if (!ride || ride.status !== RIDE_STATUSES.requested) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Ride not found or not in requested status');
  }
  ride.driver = user.id;
  ride.status = RIDE_STATUSES.accepted;
  await ride.save();
  return ride;
};

const rejectRide = async (user: JwtPayload, rideId: string) => {
  if (user.role !== USER_ROLES.driver) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only drivers can reject rides');
  }
  const ride = await Ride.findById(rideId);
  if (!ride || ride.status !== RIDE_STATUSES.requested) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Ride not found or not in requested status');
  }
  ride.status = RIDE_STATUSES.rejected;
  await ride.save();
  return ride;
};

const updateRideStatus = async (user: JwtPayload, rideId: string, status: any) => {
  if (user.role !== USER_ROLES.driver) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only drivers can update ride status');
  }
  const ride = await Ride.findById(rideId);
  if (!ride || !ride.driver || ride.driver.toString() !== user.id) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Ride not found or not assigned to this driver');
  }
  if (!Object.values(RIDE_STATUSES).includes(status)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid ride status');
  }
  ride.status = status;
  await ride.save();
  return ride;
};

const toggleAvailability = async (user: JwtPayload) => {
  if (user.role !== USER_ROLES.driver) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only drivers can toggle availability');
  }
  const driver = await Driver.findOne({ userId: user.id });
  if (!driver) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Driver profile not found');
  }
  if (!driver.isApproved) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Driver not approved');
  }
  driver.availability = driver.availability === 'online' ? 'offline' : 'online';
  await driver.save();
  return driver;
};

const getDriverRides = async (user: JwtPayload) => {
  if (user.role !== USER_ROLES.driver) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only drivers can view their rides');
  }
  const rides = await Ride.find({ driver: user.id }).populate('rider driver');
  return rides;
};

const getDriverEarnings = async (user: JwtPayload, startDate?: string, endDate?: string) => {
  if (user.role !== USER_ROLES.driver) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Only drivers can view their earnings');
  }
  const driver = await Driver.findOne({ userId: user.id });
  if (!driver) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Driver profile not found');
  }
  const systemSettings = await SystemSettings.findOne();
  if (!systemSettings) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'System settings not found');
  }
  const query: any = { driver: user.id, status: RIDE_STATUSES.completed };
  if (startDate) query.createdAt = { $gte: new Date(startDate) };
  if (endDate) query.createdAt = { ...query.createdAt, $lte: new Date(endDate) };
  const rides = await Ride.find(query).select('status createdAt updatedAt');
  // Fallback: Assume a fixed earning per completed ride if distanceKm/fare are unavailable
  const fixedEarningPerRide = systemSettings.farePerKm || 10; // Default to 10 if farePerKm is 0
  const totalEarnings = rides.length * fixedEarningPerRide;
  return {
    totalEarnings,
    rideCount: rides.length,
    rides,
  };
};

export const DriverService = {
  createDriverProfile,
  getDriverProfile,
  updateDriverProfile,
  approveDriver,
  suspendDriver,
  acceptRide,
  rejectRide,
  updateRideStatus,
  toggleAvailability,
  getDriverRides,
  getDriverEarnings,
};