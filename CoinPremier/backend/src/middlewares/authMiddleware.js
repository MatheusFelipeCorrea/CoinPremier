import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

export default function authMiddleware(req, _res, next) {
  try {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith('Bearer ')) {
	  throw new AppError('Token ausente', 401, 'AUTH_MISSING_TOKEN');
	}

	const token = authHeader.replace('Bearer ', '');
	const payload = jwt.verify(token, process.env.JWT_SECRET);
	req.user = { id: payload.sub, role: payload.role };
	return next();
  } catch (_error) {
	return next(new AppError('Token invalido', 401, 'AUTH_INVALID_TOKEN'));
  }
}


