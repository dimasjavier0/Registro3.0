const express = require('express');
const router = express.Router();
const { registrarDocente } = require('../models/Docentes-model'); // Asegúrate de tener esta función en tu módulo

router.post('/agregarDocente', async (req, res) => {
    try {
        const docenteData = req.body;
        await registrarDocente(docenteData);
        res.json({ exito: true, mensaje: 'Docente registrado con éxito' });
    } catch (error) {
        console.error('Error al registrar el docente:', error);
        res.status(500).json({ exito: false, mensaje: 'Error al procesar la solicitud', error: error.message });
    }
});

module.exports = router;
