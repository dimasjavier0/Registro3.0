const express = require('express');
const {activarProcesoEvaluacion} = require('../controllers/notaEstudiante')

const router = express.Router();

router.get('/', async (req, res) =>{
    try {
        let resultado = await activarProcesoEvaluacion();

        if (resultado.estado) {
            res.json(resultado);
        }else{
            res.status(404).json(resultado);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;