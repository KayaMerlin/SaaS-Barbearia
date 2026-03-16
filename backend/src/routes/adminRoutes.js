const express = require('express');
const verificarToken = require('../middlewares/auth');
const verificarAdmin = require('../middlewares/verificarAdmin');
const AdminController = require('../controllers/AdminController');

const router = express.Router();

router.get('/tenants', verificarToken, verificarAdmin, AdminController.listarTenants);
router.patch('/tenants/:id/estender', verificarToken, verificarAdmin, AdminController.estenderVencimento);

module.exports = router;
