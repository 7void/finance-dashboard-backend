import { ApiError } from '../utils/ApiError.js';

export const validate = (schemas) => (req, _res, next) => {
  const sources = ['body', 'query', 'params'];

  for (const source of sources) {
    if (!schemas[source]) {
      continue;
    }

    const { error, value } = schemas[source].validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(
        new ApiError(
          400,
          'Validation failed',
          error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
          }))
        )
      );
    }

    req[source] = value;
  }

  next();
};
