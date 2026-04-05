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

export const listUsers = async (query) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const filters = {};

  if (query.role) {
    filters.role = query.role;
  }

  if (query.status) {
    filters.status = query.status;
  }

  if (query.search) {
    filters.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filters),
  ]);

  return {
    data: users.map(sanitizeUser),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getUserById = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return sanitizeUser(user);
};

export const createUser = async (payload) => {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });

  if (existingUser) {
    throw new ApiError(409, 'Email is already in use');
  }

  const user = await User.create(payload);
  return sanitizeUser(user);
};

export const updateUser = async (id, payload) => {
  const user = await User.findById(id).select('+password');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (payload.email && payload.email.toLowerCase() !== user.email) {
    const emailExists = await User.findOne({ email: payload.email.toLowerCase() });

    if (emailExists) {
      throw new ApiError(409, 'Email is already in use');
    }
  }

  Object.assign(user, payload);
  await user.save();

  return sanitizeUser(user);
};
