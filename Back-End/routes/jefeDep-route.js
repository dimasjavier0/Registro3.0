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
        res.status(500).send(error.message);}
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

//Ruta para ver las secciones del periodo actual
router.get('/secciones/:num_empleado', async (req, res) =>{
    try {
        const {num_empleado} = req.params;

        let resultado = await jefeDep.seccionesPAC(num_empleado);

        if(resultado.estado){
            res.json(resultado.mensaje);
        }else{
            res.status(400).send(resultado.mensaje);
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//Ruta para que el jefe pueda ver la lista de espera de cada seccion
router.get('/listaEspera/:num_empleado/:id_seccion', async (req, res) =>{
    try{
        const {num_empleado} = req.params;
        const {id_seccion} = req.params;

        let resultado = await jefeDep.verListaEspera(num_empleado, id_seccion);

        if(resultado.estado){
            res.json(resultado.mensaje);
        }else{
            res.status(400).send(resultado.mensaje);
        }
    }catch(error){
        res.status(500).send(error);
    }
})

//Ruta para aumentar los cupos de una seccion
router.put('/aumentarCupos/:idSeccion', async (req, res) =>{
    try {
        const {idSeccion} = req.params;
        const {nuevosCupos} = req.body;

        let resultado = await jefeDep.aumentarCupos(idSeccion, nuevosCupos);

        if(resultado.estado){
            res.send(`Se aumentaron los cupos de la seccion`);
        }else{
            res.status(400).send(resultado.mensaje);
        }

    } catch (error) {
        res.status(500).json(
            {mensaje: error.message});
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

//Ruta para cancelar una seccion
router.put('/cancelarSeccion/:num_empleado', async (req, res) =>{
    try{
        const {num_empleado} = req.params;
        const seccionCancelada = req.body; 

        //Con estos datos cancelar la seccion
        let resultado = await jefeDep.cancelarSeccion(num_empleado, seccionCancelada.idSeccion, seccionCancelada.justificacion);

        if(resultado){
            res.send('Sección eliminada');
        }else{
            res.status(400).send('La sección no pertenece al departamento');
        }
    }catch(error){
        res.status(500).json(
            {mensaje: error.message});
    }
});


module.exports = router;