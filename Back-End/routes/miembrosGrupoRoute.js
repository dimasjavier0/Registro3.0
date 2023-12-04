const express = require('express');
const { agregarMiembro } = require('../controllers/miembroGrupo');
const router = express.Router();

router.post('/agregar', async (req, res) => {
    try {
        const miembro = await agregarMiembro(req.body.idGrupo, req.body.miembroId);
        res.json(miembro);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;