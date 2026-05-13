import { Router } from 'express';
import authRoutes from './auth.routes.js';
import alunoRoutes from './aluno.routes.js';
import professorRoutes from './professor.routes.js';
import empresaRoutes from './empresa.routes.js';
import lojaRoutes from './loja.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/aluno', alunoRoutes);
router.use('/professor', professorRoutes);
router.use('/empresa', empresaRoutes);
router.use('/loja', lojaRoutes);
router.use('/admin', adminRoutes);

export default router;


