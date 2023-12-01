const express = require('express');
const { enviarMensajeGrupo } = require('../controllers/mensajeGrupoController');
const router = express.Router();

router.post('/enviar', async (req, res) => {
    try {
        const mensaje = await enviarMensajeGrupo(req.body.idGrupo, req.body.remitenteId, req.body.texto);
        res.json(mensaje);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;