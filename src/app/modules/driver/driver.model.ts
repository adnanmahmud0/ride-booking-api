// driver.model.ts

import { Schema, model } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

interface IDriver {
  userId: Schema.Types.ObjectId;
  car: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
  driverInfo: {
    licenseNumber: string;
    licenseImage?: string;
  };
  isApproved: boolean;
  availability: 'online' | 'offline';
}

const driverSchema = new Schema<IDriver>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    car: {
      make: { type: String, required: true },
      model: { type: String, required: true },
      year: { type: Number, required: true },
      licensePlate: { type: String, required: true },
    },
    driverInfo: {
      licenseNumber: { type: String, required: true },
      licenseImage: { type: String },
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    availability: {
      type: String,
      enum: ['online', 'offline'],
      default: 'offline',
    },
  },
  { timestamps: true }
);

export const Driver = model<IDriver>('Driver', driverSchema);