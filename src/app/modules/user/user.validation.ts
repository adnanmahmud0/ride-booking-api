// user.validation.ts

import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ message: 'Name is required' }),
    contact: z.string({ message: 'Contact is required' }),
    email: z.string({ message: 'Email is required' }),
    password: z.string({ message: 'Password is required' }),
    location: z.string({ message: 'Location is required' }),
    profile: z.string().optional(),
  }),
});

const updateUserZodSchema = z.object({
  name: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional().refine((val) => !val || /\.(jpg|jpeg|png)$/i.test(val), {
    message: 'Image must be a valid JPG or PNG file',
  }),
});

const updateSystemSettingsZodSchema = z.object({
  body: z.object({
    farePerKm: z.number({ message: 'Fare per km must be a number' }).min(0).optional(),
    cancellationWindowMinutes: z.number({ message: 'Cancellation window must be a number' }).min(0).optional(),
  }).refine(data => data.farePerKm !== undefined || data.cancellationWindowMinutes !== undefined, {
    message: 'At least one setting must be provided',
    path: [],
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  updateSystemSettingsZodSchema,
};