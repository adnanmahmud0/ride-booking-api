// auth.validation.ts

import { z } from 'zod';

const createVerifyEmailZodSchema = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }),
    oneTimeCode: z.number({ message: 'One time code is required' }),
  }),
});

const createLoginZodSchema = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }),
    password: z.string({ message: 'Password is required' }),
  }),
});

const createForgetPasswordZodSchema = z.object({
  body: z.object({
    email: z.string({ message: 'Email is required' }),
  }),
});

const createResetPasswordZodSchema = z.object({
  body: z.object({
    newPassword: z.string({ message: 'Password is required' }),
    confirmPassword: z.string({
      message: 'Confirm Password is required',
    }),
  }),
});

const createChangePasswordZodSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      message: 'Current Password is required',
    }),
    newPassword: z.string({ message: 'New Password is required' }),
    confirmPassword: z.string({
      message: 'Confirm Password is required',
    }),
  }),
});

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

export const AuthValidation = {
  createVerifyEmailZodSchema,
  createForgetPasswordZodSchema,
  createLoginZodSchema,
  createResetPasswordZodSchema,
  createChangePasswordZodSchema,
  createUserZodSchema,
};
