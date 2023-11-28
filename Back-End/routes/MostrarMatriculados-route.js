const express = require('express');
const DocenteController = require('../controllers/MostrarMatriculados');

const router = express.Router();

router.get('/docentes/:nombreUsuario/clases', async (req, res) => {
  try {
    const clasesAsignadas = await DocenteController.obtenerClasesAsignadas(req.params.nombreUsuario);

    res.json(clasesAsignadas);
  } catch (error) {
    console.error('Error en la solicitud:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;

