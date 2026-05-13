import { Router } from 'express';
import AdminController from '../controllers/AdminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireRole from '../middlewares/roleMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import {
  adminIdParamsSchema,
  auditoriaIdParamsSchema,
  auditoriaQuerySchema,
  categoriaSchema,
  emailTemplateTipoParamsSchema,
  emailTesteSchema,
  empresaListQuerySchema,
  empresaStatusSchema,
  instituicaoSchema,
  listQuerySchema,
  perfilAdminPatchSchema,
  professorCreateSchema,
  professorListQuerySchema,
  professorPatchSchema,
} from '../validators/admin.schema.js';

const router = Router();

router.use(authMiddleware);
router.use(requireRole('ADMIN'));

router.get('/dashboard', AdminController.dashboard);

router.get('/instituicoes', validate(listQuerySchema, 'query'), AdminController.listarInstituicoes);
router.post('/instituicoes', validate(instituicaoSchema), AdminController.criarInstituicao);
router.patch('/instituicoes/:id', validate(adminIdParamsSchema, 'params'), validate(instituicaoSchema.partial()), AdminController.editarInstituicao);
router.delete('/instituicoes/:id', validate(adminIdParamsSchema, 'params'), AdminController.removerInstituicao);

router.get('/professores', validate(professorListQuerySchema, 'query'), AdminController.listarProfessores);
router.post('/professores', validate(professorCreateSchema), AdminController.cadastrarProfessor);
router.patch('/professores/:id', validate(adminIdParamsSchema, 'params'), validate(professorPatchSchema), AdminController.editarProfessor);

router.get('/empresas', validate(empresaListQuerySchema, 'query'), AdminController.listarEmpresas);
router.get('/empresas/:id', validate(adminIdParamsSchema, 'params'), AdminController.detalhesEmpresa);
router.patch('/empresas/:id/status', validate(adminIdParamsSchema, 'params'), validate(empresaStatusSchema), AdminController.alterarStatusEmpresa);

router.get('/categorias', validate(listQuerySchema, 'query'), AdminController.listarCategorias);
router.post('/categorias', validate(categoriaSchema), AdminController.criarCategoria);
router.patch('/categorias/:id', validate(adminIdParamsSchema, 'params'), validate(categoriaSchema.partial()), AdminController.editarCategoria);
router.delete('/categorias/:id', validate(adminIdParamsSchema, 'params'), AdminController.removerCategoria);

router.get('/auditoria', validate(auditoriaQuerySchema, 'query'), AdminController.auditoria);
router.get('/auditoria/:id', validate(auditoriaIdParamsSchema, 'params'), AdminController.detalheAuditoria);
router.get('/vantagens/:id', validate(adminIdParamsSchema, 'params'), AdminController.detalheVantagemAdmin);
router.delete('/professores/:id', validate(adminIdParamsSchema, 'params'), AdminController.removerProfessor);
router.get('/emails/templates', AdminController.listarEmailTemplates);
router.get('/emails/templates/:tipo', validate(emailTemplateTipoParamsSchema, 'params'), AdminController.obterEmailTemplate);
router.post('/emails/teste', validate(emailTesteSchema), AdminController.enviarEmailTeste);
router.get('/perfil', AdminController.perfil);
router.patch('/perfil', validate(perfilAdminPatchSchema), AdminController.atualizarPerfil);

export default router;
