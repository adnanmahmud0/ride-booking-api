import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DriverService } from './driver.service';

const acceptRejectRide = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await DriverService.acceptRejectRide(user.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Ride ${req.body.action}ed successfully`,
    data: result,
  });
});

const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await DriverService.updateRideStatus(user.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ride status updated successfully',
    data: result,
  });
});

const setAvailability = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await DriverService.setAvailability(user.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Availability updated successfully',
    data: result,
  });
});

const getEarningsHistory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await DriverService.getEarningsHistory(user.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Earnings history retrieved successfully',
    data: result,
  });
});

export const DriverController = {
  acceptRejectRide,
  updateRideStatus,
  setAvailability,
  getEarningsHistory,
};