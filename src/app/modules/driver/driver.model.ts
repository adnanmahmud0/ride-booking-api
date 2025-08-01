import { Schema, model } from 'mongoose';
import { IDriver } from './driver.interface';

const carSchema = new Schema(
  {
    model: { type: String, required: true },
    licensePlate: { type: String, required: true },
    color: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { _id: false }
);

const driverInfoSchema = new Schema(
  {
    licenseNumber: { type: String, required: true },
    experienceYears: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const driverSchema = new Schema<IDriver>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
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
    car: { type: carSchema, required: true },
    driverInfo: { type: driverInfoSchema, required: true },
  },
  { timestamps: true }
);

export const Driver = model<IDriver>('Driver', driverSchema);