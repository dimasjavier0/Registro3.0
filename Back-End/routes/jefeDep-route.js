const express = require('express');
const jefeDep = require('../models/jefeDepartamento-model');


const router = express.Router();

//Ruta para recuperar los dias
router.get('/dias', async (req, res) =>{
    try {
        let dias = await jefeDep.seccionDias();

        res.json(dias);
   } catch (error) {
       res.status(500).json(error);
   }
});

//Ruta para verificar si el proceso de planificacion academica esta habilitado
router.get('/:num_empleado', async(req, res) =>{
    try {
         const {num_empleado} = req.params;

         let resultado = await jefeDep.verificarProceso(num_empleado);

         if(resultado.estado){
            res.json(resultado);
         }else{
            res.status(400).json(resultado);}

    } catch (error) {
        res.status(500).json(error);}
});

//Ruta para recuperar las asignaturas del departamento
router.get('/asignaturas/:num_empleado', async (req, res) =>{
    try {
        const {num_empleado} = req.params;

        let asignaturas = await jefeDep.asignaturasDep(num_empleado);

        if(asignaturas.estado){ 
            res.json(asignaturas.resultado);
        }else{
           res.status(400).json(asignaturas.resultado);}

   } catch (error) {
       res.status(500).json(error);
   }
});

//Ruta para recuperar los docentes del departamento
router.get('/docentes/:num_empleado', async (req, res) =>{
    try {
        const {num_empleado} = req.params;

        let docentes = await jefeDep.docentesDep(num_empleado);

        if(docentes.estado){ 
            res.json(docentes.resultado);
        }else{
           res.status(400).json(docentes.resultado);}

   } catch (error) {
       res.status(500).json(error);
   }
});

//Ruta para recuperar las aulas del centro regional del jefe dep
router.get('/aulas/:num_empleado', async (req, res) =>{
    try {
        const {num_empleado} = req.params;

        let aulas = await jefeDep.aulasEdificios(num_empleado);

        if(aulas.estado){ 
            res.json(aulas.resultado);
        }else{
           res.status(400).json(aulas.resultado);}

   } catch (error) {
       res.status(500).json(error);
   }
});

router.post('/crearSeccion/:num_empleado', async (req, res) =>{
    try{
        const {num_empleado} = req.params;
        const seccion = req.body; 

        let seccionValida = await jefeDep.validarSeccion(num_empleado, seccion);

        if(seccionValida.estado){
            let seccionAgregar = await jefeDep.crearSeccion(num_empleado, seccion);

            if(seccionAgregar.estado){
                res.json(seccionAgregar.mensaje);
            }else{
                res.status(400).send(seccionAgregar.mensaje)
            }
        }else{
            res.status(400).send(seccionValida.mensaje);
        }

    }catch(error){
        res.status(500).json(
            {mensaje: error.message});
    }
});

module.exports = router;