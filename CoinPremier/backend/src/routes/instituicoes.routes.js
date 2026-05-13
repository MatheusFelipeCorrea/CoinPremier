import { Router } from 'express';
import InstituicaoController from '../controllers/InstituicaoController.js';

const router = Router();

router.get('/', InstituicaoController.listar);

export default router;
