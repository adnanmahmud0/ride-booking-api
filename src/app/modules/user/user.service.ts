// user.service.ts

import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { IUser } from './user.interface';
import { User } from './user.model';
import { SystemSettings } from '../systemSettings/systemSettings.model';
import { USER_ROLES } from '../../../enums/user';


const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const getAllUsersFromDB = async () => {
  const users = await User.find({}).select('-password -authentication');
  return users;
};

const blockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  if (user.role === USER_ROLES.super_admin) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Cannot block super-admin accounts');
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: userId },
    { status: 'delete' },
    { new: true }
  );

  if (!updatedUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  return updatedUser;
};

const unblockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  user.status = 'active';
  await user.save();
  return user;
};

const deleteUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  if (user.role === USER_ROLES.super_admin) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'Cannot delete super-admin accounts');
  }
  await user.deleteOne();
  return { message: 'User deleted permanently' };
};

const updateSystemSettings = async (payload: { farePerKm?: number; cancellationWindowMinutes?: number }) => {
  const settings = await SystemSettings.findOne() || (await SystemSettings.create({}));
  if (payload.farePerKm !== undefined) {
    settings.farePerKm = payload.farePerKm;
  }
  if (payload.cancellationWindowMinutes !== undefined) {
    settings.cancellationWindowMinutes = payload.cancellationWindowMinutes;
  }
  settings.updatedAt = new Date();
  await settings.save();
  return settings;
};

const getSystemSettings = async () => {
  const settings = await SystemSettings.findOne() || (await SystemSettings.create({}));
  return settings;
};

export const UserService = {
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUsersFromDB,
  blockUser,
  unblockUser,
  deleteUser,
  updateSystemSettings,
  getSystemSettings,
};