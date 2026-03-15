const express = require('express');
const multer = require('multer');
const multerConfig = require('../config/multer');
const uploadController = require('../controllers/UploadController');
const verificarToken = require('../middlewares/auth');
const verificarAssinaturaAtiva = require('../middlewares/verificarAssinatura');

const router = express.Router();
const upload = multer({ storage: multerConfig.storage });

router.post('/', verificarToken, verificarAssinaturaAtiva, upload.single('file'), uploadController.uploadImagem.bind(uploadController));

module.exports = router;
