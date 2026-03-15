const express = require('express');
const ClienteController = require('../controllers/ClienteController');
const verificarToken = require('../middlewares/auth');
const verificarAssinaturaAtiva = require('../middlewares/verificarAssinatura');
const validarDados = require('../middlewares/validarDados');
const clienteSchema = require('../validations/clienteSchema');

const router = express.Router();

router.post('/clientes', verificarToken, verificarAssinaturaAtiva, validarDados(clienteSchema), ClienteController.criar);
router.get('/clientes', verificarToken, verificarAssinaturaAtiva, ClienteController.listar);

module.exports = router;
