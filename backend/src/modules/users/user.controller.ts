import type { RequestHandler } from 'express';
import * as authService from '../auth/auth.service.js';

const asyncHandler = (handler: RequestHandler): RequestHandler => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

export const listPending = asyncHandler(async (_req, res) => {
  res.json(await authService.listPendingUsers());
});

export const approve = asyncHandler(async (req, res) => {
  res.json(await authService.updateUserStatus(req.params['userId'] as string, 'ACTIVE'));
});

export const deactivate = asyncHandler(async (req, res) => {
  res.json(await authService.updateUserStatus(req.params['userId'] as string, 'DEACTIVATED'));
});
