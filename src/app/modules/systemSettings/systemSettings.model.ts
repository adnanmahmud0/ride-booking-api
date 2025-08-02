import { Schema, model } from 'mongoose';

interface ISystemSettings {
  farePerKm: number;
  cancellationWindowMinutes: number;
  updatedAt: Date;
}

const systemSettingsSchema = new Schema<ISystemSettings>(
  {
    farePerKm: {
      type: Number,
      default: 2.5, // Default $2.5 per km
      min: 0,
    },
    cancellationWindowMinutes: {
      type: Number,
      default: 5, // Default 5 minutes for cancellation
      min: 0,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const SystemSettings = model<ISystemSettings>('SystemSettings', systemSettingsSchema);