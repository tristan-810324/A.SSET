import type { RequestHandler } from 'express';
import type { z } from 'zod';

export const validate = (schema: z.ZodType): RequestHandler => (req, _res, next) => {
  req.body = schema.parse(req.body);
  next();
};
