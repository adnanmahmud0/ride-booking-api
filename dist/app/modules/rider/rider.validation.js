"use strict";
// rider.validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiderValidation = void 0;
const zod_1 = require("zod");
const requestRideZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        pickupLocation: zod_1.z.string().regex(/^-?\d+\.\d+,-?\d+\.\d+$/, {
            message: 'Pickup location must be in format "lng,lat" (e.g., "-74.0060,40.7128")',
        }),
        destinationLocation: zod_1.z.string().regex(/^-?\d+\.\d+,-?\d+\.\d+$/, {
            message: 'Destination location must be in format "lng,lat" (e.g., "-74.0060,40.7128")',
        }),
    }),
});
const payForRideZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentMethod: zod_1.z.enum(['credit_card', 'debit_card', 'mobile_payment'], {
            message: 'Invalid payment method',
        }),
    }),
});
exports.RiderValidation = {
    requestRideZodSchema,
    payForRideZodSchema,
};
