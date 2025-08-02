"use strict";
// driver.validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverValidation = void 0;
const zod_1 = require("zod");
const createDriverZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        car: zod_1.z.object({
            make: zod_1.z.string({ message: 'Car make is required' }),
            model: zod_1.z.string({ message: 'Car model is required' }),
            year: zod_1.z.number({ message: 'Car year is required' }).min(1900),
            licensePlate: zod_1.z.string({ message: 'License plate is required' }),
        }),
        driverInfo: zod_1.z.object({
            licenseNumber: zod_1.z.string({ message: 'License number is required' }),
            licenseImage: zod_1.z.string().optional(),
        }),
    }),
});
const updateDriverZodSchema = zod_1.z.object({
    car: zod_1.z.object({
        make: zod_1.z.string().optional(),
        model: zod_1.z.string().optional(),
        year: zod_1.z.number().min(1900).optional(),
        licensePlate: zod_1.z.string().optional(),
    }).optional(),
    driverInfo: zod_1.z.object({
        licenseNumber: zod_1.z.string().optional(),
        licenseImage: zod_1.z.string().optional().refine((val) => !val || /\.(jpg|jpeg|png)$/i.test(val), {
            message: 'License image must be a valid JPG or PNG file',
        }),
    }).optional(),
}).refine(data => data.car || data.driverInfo, {
    message: 'At least one field must be provided for update',
    path: [],
});
const updateRideStatusZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['accepted', 'in_transit', 'completed', 'cancelled', 'rejected'], {
            message: 'Invalid ride status',
        }),
    }),
});
exports.DriverValidation = {
    createDriverZodSchema,
    updateDriverZodSchema,
    updateRideStatusZodSchema,
};
