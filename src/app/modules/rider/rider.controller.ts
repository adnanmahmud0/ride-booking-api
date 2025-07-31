import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { RiderService } from './rider.service';

const requestRide = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await RiderService.requestRide(user.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Ride requested successfully',
    data: result,
  });
});

const cancelRide = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await RiderService.cancelRide(req.params.rideId, user.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ride canceled successfully',
    data: result,
  });
});

const getRideHistory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await RiderService.getRideHistory(user.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ride history retrieved successfully',
    data: result,
  });
});

export const RiderController = {
  requestRide,
  cancelRide,
  getRideHistory,
};