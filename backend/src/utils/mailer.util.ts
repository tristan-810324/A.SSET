import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

export class OtpDeliveryError extends Error {
  constructor() {
    super('OTP email delivery failed.');
    this.name = 'OtpDeliveryError';
  }
}

export const sendOtpEmail = async (email: string, code: string, purpose: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: email,
      subject: `Project A.SSET ${purpose} verification code`,
      text: `Your Project A.SSET verification code is ${code}. It expires in ${env.OTP_EXPIRES_MINUTES} minutes.`,
    });
  } catch {
    throw new OtpDeliveryError();
  }
};
