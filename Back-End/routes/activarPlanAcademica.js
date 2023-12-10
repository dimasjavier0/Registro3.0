const express = require('express');
const activarPlan = require('../controllers/planificacionAcad');


const router = express.Router();

router.post('/', async (req, res) =>{
    try {
        const {fechaInicio, fechaFin, idPeriodo} = req.body;

        let activarPlanificacion = await activarPlan.activarPlanificacion(fechaInicio, fechaFin, idPeriodo);

        if(activarPlanificacion.estado){
            res.send(activarPlanificacion.mensaje);
        }else{
            res.status(400).send(activarPlanificacion.mensaje);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
