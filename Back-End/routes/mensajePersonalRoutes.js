const express = require('express');
const { enviarMensajePersonal } = require('../controllers/mensajePersonalController');
const router = express.Router();

router.post('/enviar', async (req, res) => {
    try {
        const mensaje = await enviarMensajePersonal(req.body.remitenteId, req.body.destinatarioId, req.body.texto);
        res.json(mensaje);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;