const express = require('express');
const financeiroController = require('../controllers/FinanceiroController');
const verificarToken = require('../middlewares/auth');
const verificarAssinaturaAtiva = require('../middlewares/verificarAssinatura');

const router = express.Router();
router.get('/', verificarToken, verificarAssinaturaAtiva, financeiroController.obterResumo.bind(financeiroController));

module.exports = router;
