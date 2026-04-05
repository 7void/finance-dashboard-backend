import Joi from 'joi';
import { ALL_ROLES } from '../constants/roles.js';
import { objectId, paginationQuery } from './common.js';

export const createUserSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(50).required(),
    role: Joi.string().valid(...ALL_ROLES).required(),
    status: Joi.string().valid('active', 'inactive').default('active'),
  }),
};

export const updateUserSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(2).max(100),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(50),
    role: Joi.string().valid(...ALL_ROLES),
    status: Joi.string().valid('active', 'inactive'),
  }).min(1),
};

export const userParamsSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

export const userListQuerySchema = {
  query: paginationQuery.keys({
    role: Joi.string().valid(...ALL_ROLES),
    status: Joi.string().valid('active', 'inactive'),
  }),
};
