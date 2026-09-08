import { z } from 'zod';

// Login schema
export const loginSchema = z.object({
  email: z
    .string({ error: 'Email is required' })
    .min(1, { error: 'Email is required' })
    .pipe(z.email({ error: 'Please enter a valid email address' })),
  password: z
    .string({ error: 'Password is required' })
    .min(1, { error: 'Password is required' })
    .min(6, { error: 'Password must be at least 6 characters' }),
});

// Register schema
export const registerSchema = z
  .object({
    name: z
      .string({ error: 'Full name is required' })
      .min(1, { error: 'Full name is required' })
      .min(2, { error: 'Name must be at least 2 characters' })
      .max(50, { error: 'Name cannot exceed 50 characters' }),
    email: z
      .string({ error: 'Email is required' })
      .min(1, { error: 'Email is required' })
      .pipe(z.email({ error: 'Please enter a valid email address' })),
    password: z
      .string({ error: 'Password is required' })
      .min(1, { error: 'Password is required' })
      .min(8, { error: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { error: 'Include at least one uppercase letter' })
      .regex(/[0-9]/, { error: 'Include at least one number' }),
    confirmPassword: z
      .string({ error: 'Please confirm your password' })
      .min(1, { error: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Backend-only register schema (without confirmPassword)
export const registerSchemaBackend = z.object({
  name: z
    .string({ error: 'Full name is required' })
    .min(1, { error: 'Full name is required' })
    .min(2, { error: 'Name must be at least 2 characters' })
    .max(50, { error: 'Name cannot exceed 50 characters' }),
  email: z
    .string({ error: 'Email is required' })
    .min(1, { error: 'Email is required' })
    .pipe(z.email({ error: 'Please enter a valid email address' })),
  password: z
    .string({ error: 'Password is required' })
    .min(1, { error: 'Password is required' })
    .min(8, { error: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { error: 'Include at least one uppercase letter' })
    .regex(/[0-9]/, { error: 'Include at least one number' }),
});

// Type inference from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterInputBackend = z.infer<typeof registerSchemaBackend>;
