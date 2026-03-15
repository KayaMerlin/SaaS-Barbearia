const express = require('express');
const webhookController = require('../controllers/WebhookController');

const router = express.Router();

router.post('/pix', webhookController.receberConfirmacaoPix.bind(webhookController));
router.post('/assinatura', webhookController.receberConfirmacaoAssinatura.bind(webhookController));
router.post('/mercado-pago', webhookController.receberNotificacaoMercadoPago.bind(webhookController));

module.exports = router;
