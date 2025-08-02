"use strict";
// user.validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ message: 'Name is required' }),
        contact: zod_1.z.string({ message: 'Contact is required' }),
        email: zod_1.z.string({ message: 'Email is required' }),
        password: zod_1.z.string({ message: 'Password is required' }),
        location: zod_1.z.string({ message: 'Location is required' }),
        profile: zod_1.z.string().optional(),
    }),
});
const updateUserZodSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    contact: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    image: zod_1.z.string().optional().refine((val) => !val || /\.(jpg|jpeg|png)$/i.test(val), {
        message: 'Image must be a valid JPG or PNG file',
    }),
});
const updateSystemSettingsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        farePerKm: zod_1.z.number({ message: 'Fare per km must be a number' }).min(0).optional(),
        cancellationWindowMinutes: zod_1.z.number({ message: 'Cancellation window must be a number' }).min(0).optional(),
    }).refine(data => data.farePerKm !== undefined || data.cancellationWindowMinutes !== undefined, {
        message: 'At least one setting must be provided',
        path: [],
    }),
});
exports.UserValidation = {
    createUserZodSchema,
    updateUserZodSchema,
    updateSystemSettingsZodSchema,
};
