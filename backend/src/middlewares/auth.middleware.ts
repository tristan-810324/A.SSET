import type { RequestHandler } from 'express';
import { verifyAuthToken } from '../utils/jwt.util.js';

declare global {
  namespace Express {
    interface Request {
      auth?: ReturnType<typeof verifyAuthToken>;
    }
  }
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }
  try {
    req.auth = verifyAuthToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const requireRole = (...roles: Array<'FACULTY' | 'CUSTODIAN' | 'ADMIN'>): RequestHandler =>
  (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      res.status(403).json({ message: 'You do not have permission to perform this action.' });
      return;
    }
    next();
  };
