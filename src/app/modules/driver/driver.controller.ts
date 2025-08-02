import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { DriverService } from './driver.service';

const createDriverProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  let licenseImage = getSingleFilePath(req.files, 'licenseImage');
  const data = { ...req.body, licenseImage };
  const result = await DriverService.createDriverProfile(user, data);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Driver profile created successfully',
    data: result,
  });
});

const getDriverProfile = catchAsync(async (req: Request, res: Response) => {
  const { driverId } = req.query;
  const result = await DriverService.getDriverProfile(req.user, driverId as string);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Driver profile retrieved successfully',
    data: result,
  });
});

const updateDriverProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  let licenseImage = getSingleFilePath(req.files, 'licenseImage');
  const data = { ...req.body, licenseImage };
  const result = await DriverService.updateDriverProfile(user, data);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Driver profile updated successfully',
    data: result,
  });
});

const approveDriver = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.approveDriver(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Driver approved successfully',
    data: result,
  });
});

const suspendDriver = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.suspendDriver(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Driver suspended successfully',
    data: result,
  });
});

const acceptRide = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.acceptRide(req.user, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ride accepted successfully',
    data: result,
  });
});

const rejectRide = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.rejectRide(req.user, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ride rejected successfully',
    data: result,
  });
});

const updateRideStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.updateRideStatus(req.user, req.params.id, req.body.status);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Ride status updated successfully',
    data: result,
  });
});

const toggleAvailability = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.toggleAvailability(req.user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Availability updated successfully',
    data: result,
  });
});

const getDriverRides = catchAsync(async (req: Request, res: Response) => {
  const result = await DriverService.getDriverRides(req.user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Driver rides retrieved successfully',
    data: result,
  });
});

const getDriverEarnings = catchAsync(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const result = await DriverService.getDriverEarnings(req.user, startDate as string, endDate as string);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Driver earnings retrieved successfully',
    data: result,
  });
});

export const DriverController = {
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