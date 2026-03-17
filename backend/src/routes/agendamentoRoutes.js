const express = require('express');
const AgendamentoController = require('../controllers/AgendamentoController');
const verificarToken = require('../middlewares/auth');
const verificarAssinaturaAtiva = require('../middlewares/verificarAssinatura');
const validarDados = require('../middlewares/validarDados');
const agendamentoSchema = require('../validations/agendamentoSchema');
const agendamentoStatusSchema = require('../validations/agendamentoStatusSchema');

const router = express.Router();

router.post('/agendamentos', verificarToken, verificarAssinaturaAtiva, validarDados(agendamentoSchema), AgendamentoController.criar);
router.get('/agendamentos/resumo-semana', verificarToken, verificarAssinaturaAtiva, AgendamentoController.resumoSemana);
router.get('/agendamentos', verificarToken, verificarAssinaturaAtiva, AgendamentoController.listarPorData);
router.patch('/agendamentos/:id/status', verificarToken, verificarAssinaturaAtiva, validarDados(agendamentoStatusSchema), AgendamentoController.atualizarStatus);
router.post('/agendamentos/:id/finalizar-dinheiro', verificarToken, verificarAssinaturaAtiva, AgendamentoController.finalizarPagamentoDinheiro);

module.exports = router;
