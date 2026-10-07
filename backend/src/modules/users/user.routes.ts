import { Router } from 'express';
import { requireAuth, requireRole } from '../../middlewares/auth.middleware.js';
import * as controller from './user.controller.js';

export const userRouter = Router();
userRouter.use(requireAuth, requireRole('ADMIN'));
userRouter.get('/pending', controller.listPending);
userRouter.patch('/:userId/approve', controller.approve);
userRouter.patch('/:userId/deactivate', controller.deactivate);
