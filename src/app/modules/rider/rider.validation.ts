// rider.validation.ts

import { z } from 'zod';

const requestRideZodSchema = z.object({
  body: z.object({
    pickupLocation: z.string().regex(/^-?\d+\.\d+,-?\d+\.\d+$/, {
      message: 'Pickup location must be in format "lng,lat" (e.g., "-74.0060,40.7128")',
    }),
    destinationLocation: z.string().regex(/^-?\d+\.\d+,-?\d+\.\d+$/, {
      message: 'Destination location must be in format "lng,lat" (e.g., "-74.0060,40.7128")',
    }),
  }),
});

const payForRideZodSchema = z.object({
  body: z.object({
    paymentMethod: z.enum(['credit_card', 'debit_card', 'mobile_payment'], {
      message: 'Invalid payment method',
    }),
  }),
});

export const RiderValidation = {
  requestRideZodSchema,
  payForRideZodSchema,
};