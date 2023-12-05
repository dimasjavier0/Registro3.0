const express = require('express');
const centrosController = require('../controllers/centrosController');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const resultados = await centrosController.obtenerNombresCentros();
        res.json(resultados);
    } catch (error) {
        console.error('Error al obtener los nombres de los centros:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
