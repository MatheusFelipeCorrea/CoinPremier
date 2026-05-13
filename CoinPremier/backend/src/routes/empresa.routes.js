import { Router } from 'express';
import EmpresaController from '../controllers/EmpresaController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import {
  cupomCodigoParamsSchema,
  historicoQuerySchema,
  listarVantagensQuerySchema,
  perfilEmpresaPatchSchema,
  vantagemCreateSchema,
  vantagemParamsSchema,
  vantagemPatchSchema,
  vantagemStatusSchema,
} from '../validators/empresa.schema.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('EMPRESA'));

router.get('/dashboard', EmpresaController.dashboard);
router.get('/vantagens', validate(listarVantagensQuerySchema, 'query'), EmpresaController.listarVantagens);
router.get('/vantagens/:id', validate(vantagemParamsSchema, 'params'), EmpresaController.obterVantagem);
router.post('/vantagens', validate(vantagemCreateSchema), EmpresaController.criarVantagem);
router.patch('/vantagens/:id', validate(vantagemParamsSchema, 'params'), validate(vantagemPatchSchema), EmpresaController.editarVantagem);
router.patch('/vantagens/:id/status', validate(vantagemParamsSchema, 'params'), validate(vantagemStatusSchema), EmpresaController.alterarStatusVantagem);
router.delete('/vantagens/:id', validate(vantagemParamsSchema, 'params'), EmpresaController.removerVantagem);

router.get('/cupons/pendentes', EmpresaController.listarCuponsPendentes);
router.get('/cupons/:codigo', validate(cupomCodigoParamsSchema, 'params'), EmpresaController.buscarCupomPorCodigo);
router.post('/cupons/:codigo/validar', validate(cupomCodigoParamsSchema, 'params'), EmpresaController.validarCupom);

router.get('/historico', validate(historicoQuerySchema, 'query'), EmpresaController.historico);
router.get('/perfil', EmpresaController.perfil);
router.patch('/perfil', validate(perfilEmpresaPatchSchema), EmpresaController.atualizarPerfil);

export default router;
