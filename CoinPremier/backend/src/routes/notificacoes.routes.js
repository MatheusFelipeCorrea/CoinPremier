import { Router } from 'express';
import NotificacaoController from '../controllers/NotificacaoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import { notificacaoIdParamsSchema, notificacaoListQuerySchema } from '../validators/notificacao.schema.js';

const router = Router();

router.use(authMiddleware);

router.get('/', validate(notificacaoListQuerySchema, 'query'), NotificacaoController.listar);
router.patch('/marcar-todas-lidas', NotificacaoController.marcarTodasLidas);
router.patch('/:id/lida', validate(notificacaoIdParamsSchema, 'params'), NotificacaoController.marcarLida);
router.patch('/:id/nao-lida', validate(notificacaoIdParamsSchema, 'params'), NotificacaoController.marcarNaoLida);
router.delete('/:id', validate(notificacaoIdParamsSchema, 'params'), NotificacaoController.excluir);

export default router;
