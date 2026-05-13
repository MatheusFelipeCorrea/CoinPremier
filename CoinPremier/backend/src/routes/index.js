import { Router } from 'express';
import authRoutes from './auth.routes.js';
import instituicoesRoutes from './instituicoes.routes.js';
import alunoRoutes from './aluno.routes.js';
import empresaRoutes from './empresa.routes.js';
import adminRoutes from './admin.routes.js';
import professorRoutes from './professor.routes.js';
import notificacoesRoutes from './notificacoes.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/instituicoes', instituicoesRoutes);
router.use('/aluno', alunoRoutes);
router.use('/empresa', empresaRoutes);
router.use('/admin', adminRoutes);
router.use('/professor', professorRoutes);
router.use('/notificacoes', notificacoesRoutes);

export default router;
