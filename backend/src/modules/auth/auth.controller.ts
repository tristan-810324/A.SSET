import type { RequestHandler } from 'express';
import { z } from 'zod';
import { loginSchema, otpSchema, profileSetupSchema, registerSchema, resetRequestSchema } from './auth.schema.js';
import * as authService from './auth.service.js';

const asyncHandler = (handler: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

export const register = asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  await authService.register(input.email, input.password);
  res.status(201).json({ message: 'Registration created. Check your email for the verification code.' });
});

export const login = asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  res.json(await authService.login(input.email, input.password));
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const input = otpSchema.parse(req.body);
  const result = await authService.verifyOtp(input.email, input.code, input.type);
  res.json({ message: 'Verification successful.', ...result });
});

export const resendOtp = asyncHandler(async (req, res) => {
  const input = otpSchema.pick({ email: true, type: true }).parse(req.body);
  await authService.resendOtp(input.email, input.type);
  res.json({ message: 'A new verification code was sent.' });
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  const input = resetRequestSchema.parse(req.body);
  await authService.requestPasswordReset(input.email);
  res.json({ message: 'If the account exists, a password reset code was sent.' });
});

export const setupProfile = asyncHandler(async (req, res) => {
  const input = profileSetupSchema.parse(req.body);
  const userId = req.auth?.sub;
  if (!userId) throw new Error('Authentication required.');
  res.json(await authService.setupProfile(userId, input));
});
