const express = require('express');
const estudiantesList = require('../controllers/GenerarListaAlm');
const modeloEstudiante = require('../models/estudiantes-model');
const validarNota = require('../controllers/notaEstudiante');
 
const router = express.Router();

//Para obtener la lista de las observaciones: Aprobado, Reprobado, Abandono y No Se Presento
router.get('/observaciones', async (req, res) =>{
    try{
        let observaciones = await validarNota.getObservaciones();

        if(observaciones != null){
            res.json(observaciones);
        }else{
            res.status(400).send(observaciones);
        }
    }catch(error) {
        res.status(500).json(error);
    }
});

//La primera ruta, verificar que el proceso de ingresar notas este activo y obtener las secciones del docente
router.get('/:idDocente', async (req, res) =>{
    try {
        //Verificar que el proceso este activo FALTA
        let valido = await validarNota.verificarProcesoEvaluacion(req.params.idDocente);

        if(valido.estado){
            if (valido.periodos != 0) {
                res.json(valido);
            } else{
                res.status(400).send('No tiene secciones asignadas');
            }
        }else{
            res.status(400).send('El proceso de ingreso de notas no esta activo');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

//Para obtener la lista de los estudiantes matriculados en la seccion
router.get('/secciones/:idseccion', async (req,res) =>{
    try {
        const { idseccion } = req.params;
        let listaMod = [];

        let listaEstudiantes = await estudiantesList.obtenerEstudiantesMatriculados(idseccion);

        if (listaEstudiantes) {
            for (i in listaEstudiantes) {
                listaMod.push({
                    'Numero de cuenta': listaEstudiantes[i].num_cuenta,
                    'Nombre': listaEstudiantes[i].primer_nombre + ' ' + listaEstudiantes[i].segundo_nombre + ' '
                        + listaEstudiantes[i].primer_apellido + ' ' + listaEstudiantes[i].segundo_apellido
                });
            }

            res.json(listaMod);
        } else {
            res.status(401).json(listaEstudiantes);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});   

//para enviar los correos a los estudiantes
router.get('/finalizarIngreso/:idseccion', async (req, res) =>{
    try {
        const { idseccion } = req.params;

        let resultado = await validarNota.enviarCorreos(idseccion);

        res.send(resultado);
    //res.send(resultado);
    } catch (error) {
        res.status(500).send(error);
    }
})

//Para guardar las notas y el estado de un estudiante
router.post('/:idseccion', async (req, res) =>{
    try{
        let notas = req.body;
        const {idseccion} = req.params;

        let validar = await validarNota.validarNotas(idseccion, notas);

        if(validar.estado){
            let resultado = await modeloEstudiante.notasEstudiante(idseccion, notas.numero_cuenta,
                notas.nota, notas.observacion);

            res.status(200).json(resultado);
        }else{
            res.status(401).json(validar);
        }  
    
    }catch(error){
        res.status(500).json({'error':error.message});
    }
});

//Para modificar la nota de un estudiante

module.exports = router;