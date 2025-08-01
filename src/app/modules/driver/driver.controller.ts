import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { DriverService } from './driver.service';

const createDriverProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await DriverService.createDriverProfile(user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Driver profile created successfully',
    data: result,
  });
});

const updateDriverProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await DriverService.updateDriverProfile(user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Driver profile updated successfully',
    data: result,
  });
});

const setAvailability = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await DriverService.setAvailability(user, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Availability updated',
    data: result,
  });
});

const getEarnings = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await DriverService.getEarnings(user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Earnings retrieved',
    data: result,
  });
});

const getMyDriverProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await DriverService.getMyDriverProfile(user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Driver profile',
    data: result,
  });
});

const approveDriver = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.approveDriver(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Driver approved',
    data: result,
  });
});

const suspendDriver = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.suspendDriver(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Driver suspended',
    data: result,
  });
});

export const DriverController = {
  createDriverProfile,
  updateDriverProfile,
  setAvailability,
  getEarnings,
  getMyDriverProfile,
  approveDriver,
  suspendDriver,
};