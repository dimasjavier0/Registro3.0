const express = require('express');
const { agregarContacto, obtenerContactos } = require('../controllers/contactoController');
const router = express.Router();

router.post('/agregar', async (req, res) => {
    try {
        const contacto = await agregarContacto(req.body.estudianteId, req.body.contactoId);
        res.json(contacto);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/obtener/:estudianteId', async (req, res) => {
    try {
        const contactos = await obtenerContactos(req.params.estudianteId);
        res.json(contactos);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;

