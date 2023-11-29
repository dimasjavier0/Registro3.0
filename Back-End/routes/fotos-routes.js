const express = require('express');
const fotosController = require('../controllers/fotosController');
const multer = require('multer');

const router = express.Router();

// Configuración de multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.array('fotos', 3), fotosController.subirFotos);

module.exports = router;
