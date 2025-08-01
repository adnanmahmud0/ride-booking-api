import { Types } from 'mongoose';

export type ICar = {
  model: string;
  licensePlate: string;
  color: string;
  year: number;
};

export type IDriverInfo = {
  licenseNumber: string;
  experienceYears: number;
};

export type IDriver = {
  user: Types.ObjectId;
  isApproved: boolean;
  availability: 'online' | 'offline';
  car: ICar;
  driverInfo: IDriverInfo;
};