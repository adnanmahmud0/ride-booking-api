import { z } from 'zod';

const setAvailabilityZodSchema = z.object({
  body: z.object({
    availability: z.enum(['online', 'offline'], {
      message: 'Availability must be online or offline',
    }),
  }),
});

const createDriverProfileZodSchema = z.object({
  body: z.object({
    car: z.object({
      model: z.string({ message: 'Car model is required' }),
      licensePlate: z.string({ message: 'License plate is required' }),
      color: z.string({ message: 'Car color is required' }),
      year: z.number({ message: 'Car year is required' }).min(1900).max(new Date().getFullYear()),
    }),
    driverInfo: z.object({
      licenseNumber: z.string({ message: 'Driver license number is required' }),
      experienceYears: z.number({ message: 'Experience years is required' }).min(0),
    }),
  }),
});

const updateDriverProfileZodSchema = z.object({
  body: z.object({
    car: z.object({
      model: z.string({ message: 'Car model is required' }).optional(),
      licensePlate: z.string({ message: 'License plate is required' }).optional(),
      color: z.string({ message: 'Car color is required' }).optional(),
      year: z.number({ message: 'Car year is required' }).min(1900).max(new Date().getFullYear()).optional(),
    }).optional(),
    driverInfo: z.object({
      licenseNumber: z.string({ message: 'Driver license number is required' }).optional(),
      experienceYears: z.number({ message: 'Experience years is required' }).min(0).optional(),
    }).optional(),
  }).refine(data => data.car || data.driverInfo, {
    message: 'At least one field in car or driverInfo must be provided',
    path: [],
  }),
});

export const DriverValidation = {
  setAvailabilityZodSchema,
  createDriverProfileZodSchema,
  updateDriverProfileZodSchema,
};