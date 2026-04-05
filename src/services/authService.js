import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ROLES } from '../constants/roles.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const generateToken = (user) =>
  jwt.sign({ userId: user._id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

export const registerUser = async (payload, currentUser = null) => {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });

  if (existingUser) {
    throw new ApiError(409, 'Email is already in use');
  }

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role:
      currentUser?.role === ROLES.ADMIN && payload.role
        ? payload.role
        : ROLES.VIEWER,
    status:
      currentUser?.role === ROLES.ADMIN && payload.status
        ? payload.status
        : 'active',
  });

  return {
    token: generateToken(user),
    user: sanitizeUser(user),
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'Your account is inactive');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  return {
    token: generateToken(user),
    user: sanitizeUser(user),
  };
};
