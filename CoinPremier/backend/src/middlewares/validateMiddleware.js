import AppError from '../utils/AppError.js';

export default function validate(schema, source = 'body') {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req[source]);

    if (!parsed.success) {
      return next(
        new AppError('Dados invalidos', 422, 'VALIDATION_ERROR', parsed.error.flatten())
      );
    }

    req[source] = parsed.data;
    return next();
  };
}
