import { Router } from 'express';
import * as controller from './auth.controller.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';

export const authRouter = Router();
authRouter.post('/register', controller.register);
authRouter.post('/login', controller.login);
authRouter.post('/verify-otp', controller.verifyOtp);
authRouter.post('/resend-otp', controller.resendOtp);
authRouter.post('/request-password-reset', controller.requestPasswordReset);
authRouter.post('/profile-setup', requireAuth, controller.setupProfile);
