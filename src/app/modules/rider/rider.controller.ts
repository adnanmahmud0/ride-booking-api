import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { RideService } from './rider.service';

const requestRide = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { pickupAddress, destinationAddress, pickupLocation, destinationLocation } = req.body;
  const ride = await RideService.requestRide(user.id, { pickupAddress, destinationAddress, pickupLocation, destinationLocation });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Ride requested successfully',
    data: ride,
  });
});

const cancelRide = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const ride = await RideService.cancelRide(user.id, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ride cancelled successfully',
    data: ride,
  });
});

const acceptOrRejectRide = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { rideId, action } = req.body;
  const result = await RideService.acceptOrRejectRide(user.id, { rideId, action });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Ride ${action}ed successfully`,
    data: result,
  });
});

const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { rideId, status } = req.body;
  const result = await RideService.updateRideStatus(user.id, { rideId, status });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Ride status updated to ${status}`,
    data: result,
  });
});

const getMyRides = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { page, limit } = req.query;
  const rides = await RideService.getUserRides(user, {
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
  });
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Rides fetched successfully',
    data: rides,
  });
});

export const RideController = {
  requestRide,
  cancelRide,
  acceptOrRejectRide,
  updateRideStatus,
  getMyRides,
};