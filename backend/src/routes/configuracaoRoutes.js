const express = require('express');
const configuracaoController = require('../controllers/ConfiguracaoController');
const verificarToken = require('../middlewares/auth');
const verificarAssinaturaAtiva = require('../middlewares/verificarAssinatura');

const router = express.Router();

router.get('/', verificarToken, configuracaoController.buscarConfiguracoes.bind(configuracaoController));
router.put('/', verificarToken, verificarAssinaturaAtiva, configuracaoController.atualizarConfiguracoes.bind(configuracaoController));

module.exports = router;
