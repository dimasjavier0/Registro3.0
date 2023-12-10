const express = require('express');
const {activarProcesoEvaluacion} = require('../controllers/notaEstudiante')

const router = express.Router();

router.post('/', async (req, res) =>{
    try {
        const infoProceso = req.body;
        
        console.log('infoProceso::',infoProceso);

        let resultado = await activarProcesoEvaluacion(infoProceso.fechaInicio, infoProceso.fechaFin, infoProceso.idPeriodo);

        if (resultado.estado) {
            res.json(resultado);
        }else{
            res.status(404).json(resultado);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

module.exports = router;