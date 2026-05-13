export default function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = statusCode >= 500 ? 'Erro interno do servidor' : err.message;

  if (statusCode >= 500) {
    console.error('[error]', err);
  }

  return res.status(statusCode).json({
    error: {
      code,
      message,
      details: err.details || null,
    },
  });
}
