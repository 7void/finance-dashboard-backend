import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const authenticate = catchAsync(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Authentication token is required');
  }

  const token = authHeader.split(' ')[1];
  const payload = jwt.verify(token, env.jwtSecret);

  const user = await User.findById(payload.userId);

  if (!user) {
    throw new ApiError(401, 'Invalid authentication token');
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'Your account is inactive');
  }

  req.user = user;
  next();
});
