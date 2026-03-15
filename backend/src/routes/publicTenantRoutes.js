const express = require('express');
const publicTenantController = require('../controllers/PublicTenantController');

const router = express.Router();

router.get('/:slug', publicTenantController.buscarPorSlug.bind(publicTenantController));

module.exports = router;
