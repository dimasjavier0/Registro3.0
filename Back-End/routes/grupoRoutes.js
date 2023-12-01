const express = require('express');
const { crearGrupo } = require('../controllers/grupoController');
const router = express.Router();

router.post('/crear', async (req, res) => {
    try {
        const grupo = await crearGrupo(req.body.nombreGrupo, req.body.creadorId);
        res.json(grupo);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;