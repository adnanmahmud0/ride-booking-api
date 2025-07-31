import { z } from 'zod';

const acceptRejectRideZodSchema = z.object({
  body: z.object({
    rideId: z.string({ message: 'Ride ID is required' }),
    action: z.enum(['accept', 'reject'], { message: 'Action must be accept or reject' }),
  }),
});

const updateRideStatusZodSchema = z.object({
  body: z.object({
    rideId: z.string({ message: 'Ride ID is required' }),
    status: z.enum(['picked_up', 'in_transit', 'completed'], { message: 'Invalid status' }),
  }),
});

const setAvailabilityZodSchema = z.object({
  body: z.object({
    availability: z.enum(['online', 'offline'], { message: 'Availability must be online or offline' }),
  }),
});

export const DriverValidation = {
  acceptRejectRideZodSchema,
  updateRideStatusZodSchema,
  setAvailabilityZodSchema,
};