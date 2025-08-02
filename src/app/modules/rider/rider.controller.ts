// src/app/modules/rider/rider.controller.ts
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { RiderService } from './rider.service';

const requestRide = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderService.requestRide(req.user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ride requested successfully',
    data: result,
  });
});

const cancelRide = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderService.cancelRide(req.user, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ride cancelled successfully',
    data: result,
  });
});

const getRiderRides = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderService.getRiderRides(req.user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Rider rides retrieved successfully',
    data: result,
  });
});

const payForRide = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderService.payForRide(req.user, req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payment processed successfully',
    data: result,
  });
});

const getAllRides = catchAsync(async (req: Request, res: Response) => {
  const result = await RiderService.getAllRides();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'All rides retrieved successfully',
    data: result,
  });
});

export const RiderController = {
  requestRide,
  cancelRide,
  getRiderRides,
  payForRide,
  getAllRides,
};