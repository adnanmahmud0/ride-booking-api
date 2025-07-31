import { Model, Types } from 'mongoose';
import { IUser } from '../user/user.interface';

export type IDriver = IUser & {
  approvalStatus: 'pending' | 'approved' | 'suspended';
  availability: 'online' | 'offline';
  vehicleInfo: { type: string; plate: string } | null;
};

export type DriverModal = {
  isDriverApproved(id: string): Promise<boolean>;
} & Model<IDriver>;