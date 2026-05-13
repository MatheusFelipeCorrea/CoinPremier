import AppError from '../utils/AppError.js';

export default function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('Acesso negado', 403, 'FORBIDDEN'));
    }

    return next();
  };
}
