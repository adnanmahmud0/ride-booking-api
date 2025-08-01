import { z } from 'zod';

const coordinateSchema = z.object({
  type: z.literal('Point', { message: 'Type must be "Point"' }),
  coordinates: z
    .array(z.number(), { message: 'Coordinates must be an array of numbers' })
    .length(2, { message: 'Coordinates must contain exactly 2 values [longitude, latitude]' })
    .refine(
      ([longitude, latitude]) => longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90,
      { message: 'Longitude must be between -180 and 180, latitude between -90 and 90' }
    ),
});

const rideRequestZodSchema = z.object({
  body: z.object({
    pickupAddress: z.string({ message: 'Pickup address is required' }),
    destinationAddress: z.string({ message: 'Destination address is required' }),
    pickupLocation: coordinateSchema,
    destinationLocation: coordinateSchema,
  }),
});

const updateRideStatusZodSchema = z.object({
  body: z.object({
    rideId: z.string({ message: 'Ride ID is required' }),
    status: z.enum(['picked_up', 'in_transit', 'completed'], {
      message: 'Invalid status',
    }),
  }),
});

const acceptRejectZodSchema = z.object({
  body: z.object({
    rideId: z.string({ message: 'Ride ID is required' }),
    action: z.enum(['accept', 'reject'], { message: 'Invalid action' }),
  }),
});

export const RideValidation = {
  rideRequestZodSchema,
  updateRideStatusZodSchema,
  acceptRejectZodSchema,
};