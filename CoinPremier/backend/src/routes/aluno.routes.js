import { Router } from 'express';
import AlunoController from '../controllers/AlunoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import {
  carrinhoAddSchema,
  carrinhoPatchSchema,
  cupomIdParamsSchema,
  cuponsQuerySchema,
  detalheVantagemParamsSchema,
  extratoQuerySchema,
  itemIdParamsSchema,
  lojaQuerySchema,
  perfilPatchSchema,
  resgatarSchema,
  vantagemIdParamsSchema,
} from '../validators/aluno.schema.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('ALUNO'));

router.get('/dashboard', AlunoController.dashboard);
router.get('/loja', validate(lojaQuerySchema, 'query'), AlunoController.loja);
router.get('/loja/:id', validate(detalheVantagemParamsSchema, 'params'), AlunoController.detalheVantagem);

router.get('/carrinho', AlunoController.getCarrinho);
router.post('/carrinho', validate(carrinhoAddSchema), AlunoController.addCarrinho);
router.post('/carrinho/finalizar', AlunoController.finalizarCarrinho);
router.post('/resgatar', validate(resgatarSchema), AlunoController.resgatar);
router.patch('/carrinho/:itemId', validate(itemIdParamsSchema, 'params'), validate(carrinhoPatchSchema), AlunoController.patchCarrinhoItem);
router.delete('/carrinho/:itemId', validate(itemIdParamsSchema, 'params'), AlunoController.deleteCarrinhoItem);

router.get('/favoritos', AlunoController.getFavoritos);
router.post('/favoritos/:vantagemId', validate(vantagemIdParamsSchema, 'params'), AlunoController.toggleFavorito);

router.get('/cupons', validate(cuponsQuerySchema, 'query'), AlunoController.getCupons);
router.get('/cupons/:id', validate(cupomIdParamsSchema, 'params'), AlunoController.detalheCupom);
router.post('/cupons/:id/reenviar', validate(cupomIdParamsSchema, 'params'), AlunoController.reenviarCupom);

router.get('/ranking', AlunoController.ranking);
router.get('/extrato', validate(extratoQuerySchema, 'query'), AlunoController.extrato);
router.get('/perfil', AlunoController.perfil);
router.patch('/perfil', validate(perfilPatchSchema), AlunoController.atualizarPerfil);

export default router;
