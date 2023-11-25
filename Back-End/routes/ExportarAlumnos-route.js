const express = require('express');
const EstudianteController = require('../controllers/GenerarListaAlm');

const router = express.Router();
 // Ruta para descargar estudiantes matriculados en una sección
router.get('/Listado/:idSeccion/estudiantes', async (req, res) => {
    try {
      const fileName = await EstudianteController.descargarEstudiantesMatriculados(req.params.idSeccion);
      res.download(fileName, (err) => {
        if (err) {
          console.error('Error al descargar el archivo:', err);
          res.status(500).send('Error interno del servidor');
        }
      });
    } catch (error) {
      console.error('Error en la solicitud:', error);
      res.status(500).send('Error interno del servidor');
    }
  });
  
  module.exports = router;

