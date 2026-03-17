const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/auth/esqueci-senha', AuthController.esqueciSenha);
router.post('/auth/resetar-senha', AuthController.resetarSenha);

module.exports = router;