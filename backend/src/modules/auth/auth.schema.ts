import { z } from 'zod';

const password = z.string().min(8).max(72);
const email = z.string().trim().toLowerCase().email().max(254);

export const registerSchema = z.object({ email, password, confirmPassword: password })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
export const loginSchema = z.object({ email, password });
export const otpSchema = z.object({
  email,
  code: z.string().regex(/^\d{6}$/),
  type: z.enum(['VERIFY_ACCOUNT', 'RESET_PASSWORD']),
});
export const resetRequestSchema = z.object({ email });
export const profileSetupSchema = z.object({
  fullName: z.string().trim().min(2).max(150),
  department: z.enum([
    'College of Information Technology',
    'College of Education',
    'Senior High School Department',
    "Registrar's Office",
    'Guidance & Student Affairs Office',
    'Physical Plant & Facilities Operations',
  ]),
  designation: z.enum([
    'Dean / Principal',
    'Program Chair / Coordinator',
    'Administrative Office Head',
    'Regular Faculty / Class Adviser',
  ]),
});
