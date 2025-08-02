// user.controller.ts

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let image = getSingleFilePath(req.files, 'image');

    const data = {
      image,
      ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await UserService.getAllUsersFromDB();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Users retrieved successfully',
    data: users,
  });
});

const blockUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.blockUser(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User blocked successfully',
    data: result,
  });
});

const unblockUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.unblockUser(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User unblocked successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.deleteUser(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User deleted permanently',
    data: result,
  });
});

const updateSystemSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.updateSystemSettings(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'System settings updated successfully',
    data: result,
  });
});

const getSystemSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getSystemSettings();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'System settings retrieved successfully',
    data: result,
  });
});

export const UserController = {
  getUserProfile,
  updateProfile,
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  updateSystemSettings,
  getSystemSettings,
};