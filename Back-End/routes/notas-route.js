/**aqui es igual que el index casi.
 * pero no se utiliza la variable app.
 * SOLO:
*/
var express = require('express');
var aspirantesModel = require('../models/aspirantes-model');
const { Result } = require('postcss');
var db = require('../conections/database');
const { primer_apellido } = require('../DTOs/aspiranteDTO');
var correo = require('../controllers/correo');

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
            "PAA":1,
            "PAM":2,
            "PCN":3,
            "paa":1,
            "pam":2,
            "pcn":3
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
            /*for (let resultadoJson of resultadosExamenesAdmision){
                if(notaJSON.id == resultadoJson.id_persona){
                    console.log('\nCOMPARACION:::',resultadoJson.id_tipo_examen,notaJSON.tipoExamen,'\n');
                    if (resultadoJson.id_tipo_examen != notaJSON.tipoExamen ){*/
                        await db.query(
                            `exec [dbo].[subir_nota_estudiante] '${notaJSON.id}', ${notaJSON.tipoExamen}, ${notaJSON.nota};`
                        );/*            
                    }
                }
            }*/
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
            `SELECT c.id_carrera, rc.puntaje_minimo_examen, rc.id_tipo_examen  from aspirantes a 
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
        console.log(`<<<< RESULTADO EXAMENES de ${idPersona_aspirante}: ${JSON.stringify(resultadosExamenes)}>>>>`);
        
        /**si existen resultados en la base de datos */
        if(resultadosExamenes){
            //let carrerasAprobadasAspirante =[];
            
            let examenesAprobadosAspirante = 0;
            
            let msjFinalAspirante = [];
            let msjsAspirante = [];
            
            
            /** ver si paso la carrera Principal. ver si cumplio todos los requisitos */
            for (let requisito of requisitoAspiranteCarrera_P){
                
                /**ver si hizo ese examen *//**recorriendo todos los resultados */ 
                for (let examen of resultadosExamenes){
                    /**comparar el mismo tipo de examen */
                    console.log('<<<<<<',idPersona_aspirante,'?????????',requisito.id_tipo_examen , examen.id_tipo_examen,'>>>>>>');
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
            }
            /**si paso todos los examenes de la carrera principal entonces aprobo para esa carrera */
            if(examenesAprobadosAspirante >= requisitoAspiranteCarrera_P.length){
                msjFinalAspirante.push(`Felicidades **Aprobo** para Su Carrera Principal`);
                /**se agrega al json de los aprobados */
                aprobados[`${idPersona_aspirante}`]={
                    "msjsAspirantes":msjsAspirante,
                    "msjFinalAspirante":msjFinalAspirante,
                    "carreraPrincipal":true
                };
            }else{
                msjFinalAspirante.push(`Lo sentimos **Reprobo** para Su Carrera Principal`);
                reprobados[`${idPersona_aspirante}`]={
                    "msjsAspirantes":msjsAspirante,
                    "msjFinalAspirante":msjFinalAspirante,
                    "carreraPrincipal":false
                };
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
            }


            /**si paso todos los examenes de la carrera Principal entonces aprobo para esa carrera */
            if(examenesAprobadosAspirante >= requisitoAspiranteCarrera_S.length){
                msjFinalAspirante.push(`Felicidades **Aprobo** para Su Carrera Secundaria`);
                aprobados[`${idPersona_aspirante}`]={
                    "msjsAspirantes":msjsAspirante,
                    "msjFinalAspirante":msjFinalAspirante,
                    "carreraSecundaria":true
                };
            }else{//sino
                msjFinalAspirante.push(`Lo sentimos **Reprobo** para Su Carrera Secundaria`);
                reprobados[`${idPersona_aspirante}`]={
                    "msjsAspirantes":msjsAspirante,
                    "msjFinalAspirante":msjFinalAspirante,
                    "carreraSecundaria":false
                };
            }
            
        }

        
    }
    /**obtengo los resultados en base a los requisitos de las carreras del estudiante */
    /**enviar correo con los resultados */
    console.log("APROBADOS:",aprobados);
    
    let id;//el que sera su unica carrera

    /** recorrer la lista de aprobados para enviar correo con numero de cuenta y correo Institucional */
    for (let id_persona_aprobado of Object.keys(aprobados)){
        
        /**si aprobo la carrera Pricipal */
        if(aprobados[id_persona_aprobado].carreraPrincipal == true){
            let idCarrera = await db.query(
                `select a.carrera_principal from aspirantes a where id_persona = '${id_persona_aprobado}'`
            );
            id = idCarrera[0].carrera_principal;
        }//si no aprobo la principal entonces la 2da opcion carrera secundaria sera la carrera que estudie
        else{
            let idCarrera = await db.query(
                `select a.carrera_secundaria from aspirantes a where id_persona = '${id_persona_aprobado}'`
            );
            id = idCarrera[0].carrera_secundaria;
        }

        /**si existe la carrera a la que concurso */
        if(id){
            /** se manda a llamar el P.A para crear el estudiante con la carreraPrincipal */
            await db.query(`[dbo].[agregar_estudiante] @numIdentidad = '${id_persona_aprobado}', @id_carrera = ${id}`);
        }

        console.log(await db.query(`select * from estudiantes where id_persona = '${id_persona_aprobado}'`));

        /**enviar correo de aprobacion */
        // Consulta para agregar al estudiante y obtener su número de cuenta y correo institucional
        let estudianteInfo = await db.query(`SELECT num_cuenta, correo_institucional FROM estudiantes WHERE id_persona = '${id_persona_aprobado}'`);
        let numCuenta = estudianteInfo[0].num_cuenta;
        let correoInstitucional = estudianteInfo[0].correo_institucional;

        let infoPersonaArray = await db.query(`select * from personas p where p.numero_identidad='${id_persona_aprobado}'`);
        let jsonPersona = infoPersonaArray[0];
        
        let email = jsonPersona.correo;
        
       /* let msjPersonalizado =  
            `Hola muy buenas estimado ${jsonPersona.primer_nombre} ${jsonPersona.primer_apellido}. Por medio del presente le informamos que su puntacion es: \n
            ${aprobados[id_persona_aprobado].msjsAspirantes}.
            ${aprobados[id_persona_aprobado].msjFinalAspirante}
            Y por tanto le extendemos su numero de cuenta vigente ${jsonPersona.num_cuenta} y su proximo correo institucional ${email}
            `;
        correo.enviarCorreo(email,msjPersonalizado); */
        let msjPersonalizado = 
        `Hola muy buenas estimado ${jsonPersona.primer_nombre} ${jsonPersona.primer_apellido}. Por medio del presente le informamos que su puntuación es: \n
        ${aprobados[id_persona_aprobado].msjsAspirantes}
        Y por tanto le extendemos su número de cuenta vigente ${numCuenta} y su próximo correo institucional ${correoInstitucional}`;
    correo.enviarCorreo(jsonPersona.correo, msjPersonalizado);

    }

    //let mailText = await db.query(``);
    
    console.log("REPROBADOS:",reprobados);
    /** recorrer la lista de aprobados para enviar correo */
    for (let id_persona_reprobada of Object.keys(reprobados)){

        let infoPersonaArray = await db.query(`select * from personas p where p.numero_identidad='${id_persona_reprobada}'`);
        let jsonPersona = infoPersonaArray[0];
        
        let email = jsonPersona.correo;
        
        let msjPersonalizado = 
            `Hola muy buenas estimado ${jsonPersona.primer_nombre} ${jsonPersona.primer_apellido}. Es una pena informale que reprobo los examenes de admision. \n
            ${reprobados[id_persona_reprobada].msjsAspirantes}.
            ${reprobados[id_persona_reprobada].msjFinalAspirante}`;
        correo.enviarCorreo(email,msjPersonalizado);
    }
    
    
    /** eliminarlos de la tabla aspirantes y pasarlos a la tabla estudiante */
    

    /* eliminarlos de la tabla resultados_examen_admision y pasarlos a un historial o algo asi de examenes o Eliminarlos permanentemte */

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