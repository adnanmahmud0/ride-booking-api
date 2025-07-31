import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IRide } from '../rider/rider.interface';
import { Ride } from '../rider/rider.model';
import { IDriver } from './driver.interface';
import { Driver } from './driver.model';

const acceptRejectRide = async (driverId: string, payload: { rideId: string; action: 'accept' | 'reject' }): Promise<IRide | null> => {
    const ride = await Ride.findById(payload.rideId);
    if (!ride) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Ride not found');
    }
    if (ride.status !== 'requested') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Ride is no longer available for acceptance');
    }
    if (ride.driver) {
        throw new ApiError(StatusCodes.CONFLICT, 'Ride has already been accepted');
    }

    const driver = await Driver.findById(driverId);
    if (!driver || (driver as unknown as IDriver).approvalStatus !== 'approved') {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Driver not approved');
    }

    if (payload.action === 'accept') {
        const result = await Ride.findByIdAndUpdate(
            payload.rideId,
            { driver: driverId, status: 'accepted', updatedAt: new Date() },
            { new: true }
        );
        return result;
    } else {
        return ride; // No update for reject, just return the ride
    }
};

const updateRideStatus = async (driverId: string, payload: { rideId: string; status: 'picked_up' | 'in_transit' | 'completed' }): Promise<IRide | null> => {
    const ride = await Ride.findById(payload.rideId);
    if (!ride) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Ride not found');
    }
    if (ride.driver?.toString() !== driverId) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Unauthorized to update this ride');
    }
    if (!['picked_up', 'in_transit', 'completed'].includes(payload.status) || payload.status <= ride.status) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid status transition');
    }

    const result = await Ride.findByIdAndUpdate(
        payload.rideId,
        { status: payload.status, updatedAt: new Date() },
        { new: true }
    );
    return result;
};

const setAvailability = async (driverId: string, payload: { availability: 'online' | 'offline' }): Promise<IDriver | null> => {
    const result = await Driver.findByIdAndUpdate(
        driverId,
        { availability: payload.availability },
        { new: true }
    );
    if (!result) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Driver not found');
    }
    return result.toObject() as unknown as IDriver;
};

const getEarningsHistory = async (driverId: string): Promise<{ totalEarnings: number; rides: IRide[] }> => {
    const rides = await Ride.find({ driver: driverId, status: 'completed' });
    const totalEarnings = rides.length * 10; // Simple earnings logic (e.g., $10 per ride)
    return { totalEarnings, rides };
};

export const DriverService = {
    acceptRejectRide,
    updateRideStatus,
    setAvailability,
    getEarningsHistory,
};