import { randomInt } from 'node:crypto';
import { prisma } from '../../config/prisma.js';
import { env } from '../../config/env.js';
import { comparePassword, hashPassword } from '../../utils/password.util.js';
import { signAuthToken } from '../../utils/jwt.util.js';
import { OtpDeliveryError, sendOtpEmail } from '../../utils/mailer.util.js';
import { HttpError } from '../../utils/http-error.js';
import type { OtpType } from '@prisma/client';

const publicUser = {
  id: true,
  email: true,
  role: true,
  status: true,
  isVerified: true,
  fullName: true,
  department: true,
  designation: true,
} as const;

const generateOtp = (): string => randomInt(100000, 1000000).toString();

const createOtp = async (userId: string, email: string, type: OtpType): Promise<void> => {
  const code = generateOtp();
  await prisma.otp.deleteMany({ where: { userId, type } });
  await prisma.otp.create({
    data: {
      userId,
      type,
      codeHash: await hashPassword(code),
      expiresAt: new Date(Date.now() + env.OTP_EXPIRES_MINUTES * 60_000),
    },
  });
  await sendOtpEmail(email, code, type === 'VERIFY_ACCOUNT' ? 'account' : 'password reset');
};

export const register = async (email: string, password: string): Promise<void> => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new HttpError(409, 'An account with this email already exists. Try signing in instead.');
  const user = await prisma.user.create({
    data: { email, passwordHash: await hashPassword(password) },
  });
  try {
    await createOtp(user.id, user.email, 'VERIFY_ACCOUNT');
  } catch (error) {
    if (!(error instanceof OtpDeliveryError)) throw error;
    await prisma.otp.deleteMany({ where: { userId: user.id, type: 'VERIFY_ACCOUNT' } });
    await prisma.user.delete({ where: { id: user.id } });
    throw new HttpError(503, 'We could not send the verification email. Please try registering again in a moment.');
  }
};

export const verifyOtp = async (email: string, code: string, type: OtpType) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid verification request.');
  const otp = await prisma.otp.findFirst({
    where: { userId: user.id, type, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });
  if (!otp || !(await comparePassword(code, otp.codeHash))) throw new Error('Invalid or expired code.');
  await prisma.$transaction([
    prisma.otp.delete({ where: { id: otp.id } }),
    ...(type === 'VERIFY_ACCOUNT'
      ? [prisma.user.update({ where: { id: user.id }, data: { isVerified: true } })]
      : []),
  ]);
  if (type === 'VERIFY_ACCOUNT') {
    return {
      token: signAuthToken({
        sub: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      }),
      status: user.status,
    };
  }
  return undefined;
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email }, select: { ...publicUser, passwordHash: true } });
  if (!user || !(await comparePassword(password, user.passwordHash))) {
    throw new HttpError(401, 'Invalid email or password.');
  }
  if (!user.isVerified) throw new HttpError(403, 'Please verify your email first.');
  if (user.status === 'DEACTIVATED') throw new HttpError(403, 'Your account has been deactivated.');
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return { token: signAuthToken({ sub: user.id, email: user.email, role: user.role, status: user.status }), user: safeUser };
};

export const setupProfile = async (userId: string, data: { fullName: string; department: string; designation: string }) =>
  prisma.user.update({
    where: { id: userId },
    data: { ...data, status: 'PENDING_APPROVAL' },
    select: publicUser,
  });

export const requestPasswordReset = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) await createOtp(user.id, user.email, 'RESET_PASSWORD');
};

export const resendOtp = async (email: string, type: OtpType): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid verification request.');
  await createOtp(user.id, user.email, type);
};

export const listPendingUsers = () =>
  prisma.user.findMany({
    where: { status: 'PENDING_APPROVAL' },
    select: publicUser,
    orderBy: { createdAt: 'asc' },
  });

export const updateUserStatus = async (userId: string, status: 'ACTIVE' | 'DEACTIVATED') =>
  prisma.user.update({
    where: { id: userId },
    data: { status },
    select: publicUser,
  });
