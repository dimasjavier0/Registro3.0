const express = require('express');
const controllerJefe = require('../controllers/controllerJefe');

const router = express.Router();

//para ver las evaluaciones del docente en cada seccion que dio
router.get('/evaluacionDocente/:idDocente/:idSeccion', async (req, res) =>{
    try{
        const {idDocente} = req.params;
        const {idSeccion} = req.params;

        let resultado = await controllerJefe.mostrarEvaluaciones(idDocente, idSeccion);

        if(resultado.estado){
            res.json(resultado.mensaje);
        }else{
            res.status(400).send(resultado.mensaje);
        }
    }catch(error){
        res.status(500).send(error);
    }
})

module.exports = router;