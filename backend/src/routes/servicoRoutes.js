const express = require('express');
const ServicoController = require('../controllers/ServicoController');
const verificarToken = require('../middlewares/auth');
const verificarAssinaturaAtiva = require('../middlewares/verificarAssinatura');

const router = express.Router();
const validarDados = require('../middlewares/validarDados');
const servicoSchema = require('../validations/servicoSchema');

router.post('/servicos', verificarToken, verificarAssinaturaAtiva, validarDados(servicoSchema), ServicoController.criar);
router.get('/servicos', verificarToken, verificarAssinaturaAtiva, ServicoController.listar);

module.exports = router;

