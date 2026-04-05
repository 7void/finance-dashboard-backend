import Joi from 'joi';
import { objectId, paginationQuery } from './common.js';

const recordBody = {
  amount: Joi.number().positive(),
  type: Joi.string().valid('income', 'expense'),
  category: Joi.string().trim().min(2).max(100),
  date: Joi.date().iso(),
  note: Joi.string().trim().max(500).allow(''),
  userId: objectId,
};

export const createRecordSchema = {
  body: Joi.object({
    amount: recordBody.amount.required(),
    type: recordBody.type.required(),
    category: recordBody.category.required(),
    date: recordBody.date.required(),
    note: recordBody.note.default(''),
    userId: recordBody.userId.optional(),
  }),
};

export const updateRecordSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object(recordBody).min(1),
};

export const recordParamsSchema = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

export const listRecordsQuerySchema = {
  query: paginationQuery.keys({
    type: Joi.string().valid('income', 'expense'),
    category: Joi.string().trim(),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    userId: objectId,
  }),
};

export const dashboardQuerySchema = {
  query: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    userId: objectId,
    limit: Joi.number().integer().min(1).max(20).default(5),
  }),
};
