import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IRide } from './rider.interface';
import { Ride } from './rider.model';
import { Driver } from '../driver/driver.model';

const getAvailableDrivers = async () => {
    const drivers = await Driver.find(
        { approvalStatus: 'approved', availability: 'online' },
        { name: 1, availability: 1, vehicleInfo: 1 }
    );
    return drivers;
};

const requestRide = async (riderId: string, payload: Partial<IRide>): Promise<IRide> => {
    const rideData = {
        rider: riderId,
        pickupLocation: payload.pickupLocation,
        destinationLocation: payload.destinationLocation,
        status: 'requested',
    };
    const result = await Ride.create(rideData);
    if (!result) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to request ride');
    }
    return result;
};

const cancelRide = async (rideId: string, riderId: string, payload: { cancelReason?: string }): Promise<IRide | null> => {
    const ride = await Ride.isRideExist(rideId);
    if (!ride) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Ride not found');
    }
    if (ride.rider.toString() !== riderId) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Unauthorized to cancel this ride');
    }
    if (ride.status !== 'requested') {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Ride can only be canceled if requested');
    }
    const result = await Ride.findByIdAndUpdate(
        rideId,
        { status: 'canceled', cancelReason: payload.cancelReason, updatedAt: new Date() },
        { new: true }
    );
    return result;
};

const getRideHistory = async (riderId: string): Promise<IRide[]> => {
    const result = await Ride.find({ rider: riderId }).sort({ createdAt: -1 });
    if (!result.length) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'No ride history found');
    }
    return result;
};

export const RiderService = {
    getAvailableDrivers,
    requestRide,
    cancelRide,
    getRideHistory,
};