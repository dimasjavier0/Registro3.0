/**aqui es igual que el index casi.
 * pero no se utiliza la variable app.
 * SOLO:
*/
var express = require('express');
var aspirantesModel = require('../models/aspirantes-model');
const { Result } = require('postcss');
var db = require('../conections/database');


var router = express.Router(); // en lugar de app usar router.
//var db = require('../conections/database');


router.post('/', async (req,res)=>{
    try {
        
        
        let status={
            0:'no se han registrado notas',
            1:'no existen los usuarios ingresados',
            2:'error en los datos ingresados',
            3:'se han ingresado notas',
            4:'no existen aspirantes'
        }; 
        let msj = status[0];

        let carrerasCodigos = {
            'PAA':1,
            'PAM':2,
            'PCN':3,
            'paa':1,
            'pam':2,
            'pcn':3
        };

        /** notas es una arreglo de notas [[,,],[]]*/
        console.log("Peticion Recibida:",req.body);

        /** cambiar de letras a codigos de los examenes */
        req.body.csvData.forEach( nota => {
            nota.tipoExamen = carrerasCodigos[`${nota.tipoExamen}`];
        });

        let notasRecibidas = req.body.csvData;//arreglo de JSONs
        
        console.log("notas Recibidas:",notasRecibidas);
        
        //var datos = {"validos":[],"invalidos":[]};
        let existentes = [];//array de notasJSON
        let inexistentes = [];


        
        /**si el aspirante existe en la base datos des aspirantes*/
        await db.connect();
        let lista_IdPersonas_Aspirantes = await db.query(`select id_persona from aspirantes`);
        
        console.log(`aspirantes existentes:`,lista_IdPersonas_Aspirantes);
        
        existenAspirantes(notasRecibidas,lista_IdPersonas_Aspirantes,existentes,inexistentes);


        console.log('existentes::',existentes);
        console.log('inexistentes::',inexistentes);

        /**verificar que no tiene ese examen subido */
        let resultadosExamenesAdmision = await db.query(`select * from resultados_examen_admision`);
        //let exist = false;

        //let notasValidasToSubmit = [];


        /**subir notas de los aspirantes que si existen */
        for (let notaJSON of existentes){
            for (let resultadoJson of resultadosExamenesAdmision){
                if(notaJSON.id == resultadoJson.id_persona){
                    console.log('\nCOMPARACION:::',resultadoJson.id_tipo_examen,notaJSON.tipoExamen,'\n');
                    if (resultadoJson.id_tipo_examen != notaJSON.tipoExamen ){
                        await db.query(
                            `exec [dbo].[subir_nota_estudiante] '${notaJSON.id}', ${notaJSON.tipoExamen}, ${notaJSON.nota};`
                        );            
                    }
                }
            }            
        };

        
        res.send(
            {
                'msj': msj[3],
                'notasIngresadas':existentes,
                'aspirantesNoExisten':inexistentes
            }
        );

        /**cerrando conexion */
        await db.close();

        evaluarAspirantes();

    } catch (error) {
        console.log("::OCURRRIO UN ERROR::",error);
    }
});

/**revisa si el estudiante aprobo para una o ambas carreas, o si reprobo para ambas.
 * En cualquier caso manda el correo informando los resultados
 */
async function evaluarAspirantes(){

    var aprobados = {}, reprobados={};
    //var msjs = [];

    await db.connect();
    
    /** lista de aspirantes que hicieron examen de admision*/
    let listaAspirantesId_conExamenes = await db.query(`select distinct a.id_persona from aspirantes a inner join resultados_examen_admision rea on a.id_aspirante = rea.id_aspirante;`);
    
    console.log(':::LISTA:::',listaAspirantesId_conExamenes);

    for (let idPersonaJson of listaAspirantesId_conExamenes){
        
        let idPersona_aspirante = idPersonaJson.id_persona;
        console.log('::::::::::::',idPersona_aspirante);

        
        let requisitoAspiranteCarrera_P = await db.query(
            `SELECT c.id_carrera, rc.puntaje_minimo_examen, rc.id_tipo_examen from aspirantes a 
            inner join carreras c on a.carrera_principal = c.id_carrera --or a.carrera_secundaria = c.id_carrera
            inner join requisitos_carreras rc on c.id_carrera = rc.id_carrera
            where a.id_persona = '${idPersona_aspirante}'`
        );
        let requisitoAspiranteCarrera_S = await db.query(
            `SELECT c.id_carrera, rc.puntaje_minimo_examen, rc.id_tipo_examen from aspirantes a 
            inner join carreras c on a.carrera_secundaria = c.id_carrera --en este caso medicina --4
            inner join requisitos_carreras rc on c.id_carrera = rc.id_carrera
            where a.id_persona = '${idPersona_aspirante}'`
        );

        let resultadosExamenes = await db.query(
            `select rea.nota, rea.id_tipo_examen from aspirantes a
            inner join resultados_examen_admision rea on rea.id_persona=a.id_persona
            where a.id_persona = '${idPersona_aspirante}'`
        );
        

        
        /**si hizo examenes */
        console.log(`<<<< RESULTADO EXAMENES de ${idPersona_aspirante}: ${resultadosExamenes}>>>>`);
        
        if(resultadosExamenes){
            //let carrerasAprobadasAspirante =[];
            
            let examenesAprobadosAspirante = 0;
            
            let msjFinalAspirante = [];
            let msjsAspirante = [];
            
            
            /** ver si paso la carrera Principal. ver si cumplio todos los requisitos */
            for (let requisito of requisitoAspiranteCarrera_P){
                
                /**ver si hizo ese examen */
                for (let examen of resultadosExamenes){
                    /**comparar el mismo tipo de examen */
                    console.log('<<<<',requisito.id_tipo_examen,examen.id_tipo_examen,'>>>>>');
                    if(requisito.id_tipo_examen == examen.id_tipo_examen){
                        /**ver si saco la calificacion en ese examen */
                        if(examen.nota >= requisito.puntaje_minimo_examen){
                            msjsAspirante.push(`examen ${examen.id_tipo_examen} aprobo con ${examen.nota}`);
                            examenesAprobadosAspirante ++;
                        }else{/**en otro caso, no paso la carrera Principal */        
                            msjsAspirante.push(`examen ${examen.id_tipo_examen} reprobo con ${examen.nota}`);
                        }
                    }
                }   
            }

            /**si paso todos los examenes de la carrera principal entonces aprobo para esa carrera */
            if(examenesAprobadosAspirante >= requisitoAspiranteCarrera_P){
                msjFinalAspirante.push(`Felicidades **Aprobo** para Su Carrera Principal`);
                /**se agrega al json de los aprobados */
                aprobados[`${idPersona_aspirante}`]={"msjsAspirantes":msjsAspirante,"msjFinalAspirante":msjFinalAspirante};
            }else{
                msjFinalAspirante.push(`Lo sentimos **Reprobo** para Su Carrera Principal`);
                reprobados[`${idPersona_aspirante}`]={"msjsAspirantes":msjsAspirante,"msjFinalAspirante":msjFinalAspirante};
            }

            examenesAprobadosAspirante = 0;
            
            /** ver si paso la carrera Secundaria */
            for (let requisito of requisitoAspiranteCarrera_S){
                
                /**ver si hizo ese examen */
                for (let examen of resultadosExamenes){
                    /**comparar el mismo tipo de examen */
                    if(requisito.id_tipo_examen == examen.id_tipo_examen){
                        /**ver si saco la calificacion en ese examen */
                        console.log('<<<<<<',examen.nota, requisito.puntaje_minimo_examen,'>>>>>>');
                        if(examen.nota >= requisito.puntaje_minimo_examen){
                            msjsAspirante.push(`examen ${examen.id_tipo_examen} aprobo con ${examen.nota}`);
                            examenesAprobadosAspirante ++;
                        }else{/**en otro caso, no paso la carrera Principal */        
                            msjsAspirante.push(`examen ${examen.id_tipo_examen} reprobo con ${examen.nota}`);
                        }
                    }
                } 
                examenesAprobadosAspirante = 0;  
            }

            /**si paso todos los examenes de la carrera Secundaria entonces aprobo para esa carrera */
            if(examenesAprobadosAspirante >= requisitoAspiranteCarrera_P){
                msjFinalAspirante.push(`Felicidades **Aprobo** para Su Carrera Secundaria`);
                aprobados[`${idPersona_aspirante}`]={"msjsAspirantes":msjsAspirante,"msjFinalAspirante":msjFinalAspirante};
            }else{
                msjFinalAspirante.push(`Lo sentimos **Reprobo** para Su Carrera Secundaria`);
                reprobados[`${idPersona_aspirante}`]={"msjsAspirantes":msjsAspirante,"msjFinalAspirante":msjFinalAspirante};
            }
            
        }

        
    }
    /**obtengo los resultados en base a los requisitos de las carreras del estudiante */
    /**enviar correo con los resultados */
    console.log("APROBADOS:",aprobados);
    console.log("REPROBADOS:",reprobados);
    await db.close();
}

function existenAspirantes(arrayNotas,arrayIdAspirantes,existentes,inexistentes){

    for (const notaJson of arrayNotas) {
        let encontrado = false;

        for (const jsonId of arrayIdAspirantes) {
            if (jsonId.id_persona == notaJson.id) {//utilizar === pero parsear al mismo tipo de dato
                existentes.push(notaJson);
                encontrado = true;
                break;
            }
        }

        if (!encontrado) {
            inexistentes.push(notaJson.id);
        }
    }
};


//evaluarAspirantes();
/**y se exporta todo el objeto completo.*/
module.exports = router;