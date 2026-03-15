const express = require('express');
const assinaturaController = require('../controllers/AssinaturaController');
const verificarToken = require('../middlewares/auth');

const router = express.Router();

router.get('/status', verificarToken, assinaturaController.obterStatus.bind(assinaturaController));
router.post('/gerar-pix', verificarToken, assinaturaController.gerarPix.bind(assinaturaController));

module.exports = router;
