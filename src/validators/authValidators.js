import Joi from 'joi';
import { ALL_ROLES } from '../constants/roles.js';

export const registerSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
    role: Joi.string().valid(...ALL_ROLES).optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
  }),
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
