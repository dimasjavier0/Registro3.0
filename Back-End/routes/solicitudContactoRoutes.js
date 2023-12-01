const express = require('express');
const { enviarSolicitud, obtenerSolicitudes } = require('../controllers/solicitudContactoController');
const router = express.Router();

router.post('/enviar', async (req, res) => {
    try {
        const solicitud = await enviarSolicitud(req.body.solicitanteId, req.body.solicitadoId);
        res.json(solicitud);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/obtener/:solicitadoId', async (req, res) => {
    try {
        const solicitudes = await obtenerSolicitudes(req.params.solicitadoId);
        res.json(solicitudes);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;