import { Router } from 'express';
import ProfessorController from '../controllers/ProfessorController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import {
  atualizarPerfilProfessorSchema,
  enviarMoedasSchema,
  extratoProfessorQuerySchema,
  listarAlunosQuerySchema,
} from '../validators/professor.schema.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('PROFESSOR'));

router.get('/dashboard', ProfessorController.dashboard);
router.get('/alunos', validate(listarAlunosQuerySchema, 'query'), ProfessorController.listarAlunos);
router.post('/enviar-moedas', validate(enviarMoedasSchema), ProfessorController.enviarMoedas);
router.post('/reconhecimentos', validate(enviarMoedasSchema), ProfessorController.enviarMoedas);
router.get('/extrato', validate(extratoProfessorQuerySchema, 'query'), ProfessorController.extrato);
router.get('/perfil', ProfessorController.perfil);
router.patch('/perfil', validate(atualizarPerfilProfessorSchema), ProfessorController.atualizarPerfil);

export default router;
