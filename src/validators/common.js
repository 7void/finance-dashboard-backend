import Joi from 'joi';

export const objectId = Joi.string().hex().length(24);

export const paginationQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow(''),
  sortBy: Joi.string()
    .valid('createdAt', 'updatedAt', 'date', 'amount', 'category')
    .default('date'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});
