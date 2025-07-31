import { z } from 'zod';

const requestRideZodSchema = z.object({
  body: z.object({
    pickupLocation: z.object({
      coordinates: z.array(z.number()).length(2),
    }),
    destinationLocation: z.object({
      coordinates: z.array(z.number()).length(2),
    }),
  }),
});

const cancelRideZodSchema = z.object({
  body: z.object({
    cancelReason: z.string().optional(),
  }),
});

export const RiderValidation = {
  requestRideZodSchema,
  cancelRideZodSchema,
};