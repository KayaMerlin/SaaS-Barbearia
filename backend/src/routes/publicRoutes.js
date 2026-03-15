const express = require('express');
const publicController = require('../controllers/PublicController');

const router = express.Router();

router.get('/loja/:slug/servicos', publicController.listarServicos.bind(publicController));
router.get('/loja/:slug/horarios', publicController.listarHorariosDisponiveis.bind(publicController));
router.post('/loja/:slug/agendar', publicController.criarAgendamento.bind(publicController));

module.exports = router;
