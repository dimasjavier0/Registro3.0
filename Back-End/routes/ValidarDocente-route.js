// routes/ValidarDocente.js
const express = require('express');
const router = express.Router();
const { validarDocente } = require('../controllers/Validador-Docente');

router.post('/validar', async (req, res) => {
  try {
    const { Identidad, numeroEmpleado } = req.body;
    const existe = await validarDocente(Identidad, numeroEmpleado);
    res.json(existe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
