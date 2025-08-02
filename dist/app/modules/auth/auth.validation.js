"use strict";
// auth.validation.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const createVerifyEmailZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: 'Email is required' }),
        oneTimeCode: zod_1.z.number({ message: 'One time code is required' }),
    }),
});
const createLoginZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: 'Email is required' }),
        password: zod_1.z.string({ message: 'Password is required' }),
    }),
});
const createForgetPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ message: 'Email is required' }),
    }),
});
const createResetPasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        newPassword: zod_1.z.string({ message: 'Password is required' }),
        confirmPassword: zod_1.z.string({
            message: 'Confirm Password is required',
        }),
    }),
});
const createChangePasswordZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string({
            message: 'Current Password is required',
        }),
        newPassword: zod_1.z.string({ message: 'New Password is required' }),
        confirmPassword: zod_1.z.string({
            message: 'Confirm Password is required',
        }),
    }),
});
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
exports.AuthValidation = {
    createVerifyEmailZodSchema,
    createForgetPasswordZodSchema,
    createLoginZodSchema,
    createResetPasswordZodSchema,
    createChangePasswordZodSchema,
    createUserZodSchema,
};
