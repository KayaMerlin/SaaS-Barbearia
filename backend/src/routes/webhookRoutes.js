const express = require('express');
const webhookController = require('../controllers/WebhookController');

const router = express.Router();

router.post('/mercado-pago', webhookController.receberNotificacaoMercadoPago.bind(webhookController));

module.exports = router;
