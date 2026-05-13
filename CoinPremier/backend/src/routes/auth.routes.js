import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import validate from '../middlewares/validateMiddleware.js';
import {
  cadastroAlunoSchema,
  cadastroEmpresaSchema,
  loginSchema,
} from '../validators/auth.schema.js';

const router = Router();

router.post('/login', validate(loginSchema), AuthController.login);
router.post('/cadastro/aluno', validate(cadastroAlunoSchema), AuthController.cadastroAluno);
router.post('/cadastro/empresa', validate(cadastroEmpresaSchema), AuthController.cadastroEmpresa);

export default router;
