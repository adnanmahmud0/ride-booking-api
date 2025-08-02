// driver.validation.ts

import { z } from 'zod';

const createDriverZodSchema = z.object({
  body: z.object({
    car: z.object({
      make: z.string({ message: 'Car make is required' }),
      model: z.string({ message: 'Car model is required' }),
      year: z.number({ message: 'Car year is required' }).min(1900),
      licensePlate: z.string({ message: 'License plate is required' }),
    }),
    driverInfo: z.object({
      licenseNumber: z.string({ message: 'License number is required' }),
      licenseImage: z.string().optional(),
    }),
  }),
});

const updateDriverZodSchema = z.object({
  car: z.object({
    make: z.string().optional(),
    model: z.string().optional(),
    year: z.number().min(1900).optional(),
    licensePlate: z.string().optional(),
  }).optional(),
  driverInfo: z.object({
    licenseNumber: z.string().optional(),
    licenseImage: z.string().optional().refine((val) => !val || /\.(jpg|jpeg|png)$/i.test(val), {
      message: 'License image must be a valid JPG or PNG file',
    }),
  }).optional(),
}).refine(data => data.car || data.driverInfo, {
  message: 'At least one field must be provided for update',
  path: [],
});

const updateRideStatusZodSchema = z.object({
  body: z.object({
    status: z.enum(['accepted', 'in_transit', 'completed', 'cancelled', 'rejected'], {
      message: 'Invalid ride status',
    }),
  }),
});

export const DriverValidation = {
  createDriverZodSchema,
  updateDriverZodSchema,
  updateRideStatusZodSchema,
};