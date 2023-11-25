const express = require('express');
const router = express.Router();
const videoController = require('../controllers/Subir-Videos'); // Ajusta la ruta según tu estructura de archivos

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Directorio donde se almacenarán los videos

router.post('/', upload.single('video'), async (req, res) => {
  try {
    const { idSeccion } = req.body;
    const { path: videoPath } = req.file;

    await videoController.subirYGuardarVideo(idSeccion, videoPath);

    res.status(200).json({ success: true, message: 'Video subido y guardado en la base de datos exitosamente.' });
  } catch (error) {
    console.error('Error al subir video y guardar en la base de datos:', error);
    res.status(500).json({ success: false, message: 'Error al subir el video y guardar en la base de datos.' });
  }
});

module.exports = router;
