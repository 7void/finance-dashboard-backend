import {
  createUser,
  getUserById,
  listUsers,
  updateUser,
} from '../services/userService.js';
import { catchAsync } from '../utils/catchAsync.js';

export const getUsers = catchAsync(async (req, res) => {
  const result = await listUsers(req.query);

  res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    data: result.data,
    pagination: result.pagination,
  });
});

export const getUser = catchAsync(async (req, res) => {
  const user = await getUserById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User fetched successfully',
    data: user,
  });
});

export const createNewUser = catchAsync(async (req, res) => {
  const user = await createUser(req.body);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

export const updateExistingUser = catchAsync(async (req, res) => {
  const user = await updateUser(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});
