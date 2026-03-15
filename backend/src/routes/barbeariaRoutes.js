const express = require('express');
const BarbeariaController = require('../controllers/BarbeariaController');
const validarDados = require('../middlewares/validarDados');
const barbeariaSchema = require('../validations/barbeariaSchema');
const router = express.Router();

router.post('/barbearias', validarDados(barbeariaSchema), BarbeariaController.criar);

module.exports = router;

