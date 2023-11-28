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
var fm = require('../controllers/fileManager');

const path = require('path');

var router = express.Router(); // en lugar de app usar router.
//var db = require('../conections/database');

/**subir una nota a tabla resultados_examen_admision */
router.post('/', async (req,res)=>{
    try {
        await db.connect();
        
        let status={
            0:'no se han registrado notas',
            1:'no existen los usuarios ingresados',
            2:'error en los datos ingresados',
            3:'se han subdo las notas',
            4:'no existen aspirantes'
        }; 
        let msj = status[0];

        var carrerasCodigos = {
            "PAA":1,
            "PAM":2,
            "PCN":3,
            "paa":1,
            "pam":2,
            "pcn":3
        };



        /** se reciben las notas como un arreglo de notasJson [[,,],[]]*/
        //console.log("Peticion Recibida:",req.body);

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
        //await db.connect();
        let lista_IdPersonas_Aspirantes = await db.query(`select id_persona from aspirantes`);
        
        console.log(`aspirantes existentes en la base :`,lista_IdPersonas_Aspirantes);
        
        existenAspirantes(notasRecibidas,lista_IdPersonas_Aspirantes,existentes,inexistentes);


        console.log('existentes::',existentes);
        console.log('inexistentes::',inexistentes);

        /**verificar que no tiene ese examen subido */
        let resultadosExamenesAdmision = await db.query(`select * from resultados_examen_admision`);
        //let exist = false;

        //let notasValidasToSubmit = [];

        //await db.close();

        /**se sube la nota de los aspirantes que si existen. */
        for (let notaJSON of existentes){
            //await db.connect();
            await db.query(
                `EXEC [dbo].[subir_nota_estudiante] @p_identidad = '${notaJSON.id}', @p_tipo_examen = ${notaJSON.tipoExamen}, @p_nota = ${notaJSON.nota};`
            );
            //await db.close();
        };

        
        let resultadoFinal = await evaluarNotas(existentes);
        

        let respuesta = {
            'msj': msj[3],
            'notasIngresadas':existentes,
            'aspirantesNoExisten':inexistentes,
            'mensajeFinal':resultadoFinal.msj,
            'resultados':[
                {"aprobados":resultadoFinal.aprobados},
                {"reprobados":resultadoFinal.reprobados}
            ],
            "a":resultadoFinal.a
        };

        await enviarResultados(respuesta.resultados[0].aprobados);//se envia un json
        await enviarResultados(respuesta.resultados[1].reprobados);

        let csv = generarFilasCsvEstudiantes(respuesta.resultados[0].aprobados);
        //generarFilasCsvEstudiantes(respuesta.resultados[1].reprobados);

        await fm.write('./public/estudiantes.csv', csv);

        // Esto te llevará del directorio actual ('routes') al directorio raíz y luego a 'public'
        const filePath = path.join(__dirname, '..', 'public', 'estudiantes.csv');

        //res.redirect('http://localhost:8888/public/estudiantes.csv');
        //res.sendFile('C:\Users\Dell\Documents\GitHub\Registro_3.0\Back-End\public\estudiantes.csv');

        //res.setHeader('Content-Disposition', 'attachment; filename=estudiantes.csv');
        //res.sendFile(filePath);

        console.log(filePath);
        res.json(
            {'msj':'archivo creado con EXito'}
        );
        /**cerrando conexion */
        
    } catch (error) {
        console.log("::OCURRRIO UN ERROR::",error);
    }finally{
        await db.close();
    }
});

async function enviarResultados(contentJson){
    try {
        let observaciones;
        console.log(contentJson);
        let mensaje = '';
        let email;
        /**recorrer resultados para enviar: */
        for (resultado of contentJson){
            let r = Object.values(resultado)[0];
            console.log(`"""""""""""""RESULATDO`,r);
            email = r.informacion.correo;
            
            observaciones = limpiarObservaciones(r.observaciones);

            /**enviar correo a cada uno */
            mensaje = 
            `
                Hola estimado ${r.informacion.primer_nombre} ${r.informacion.primer_apellido}, por este medio le brindamos los resultados de la UNAH. 
                ${observaciones}
            `;
            console.log(observaciones);
            correo.enviarCorreo(email,'RESULTADOS UNAH ADMISION',mensaje);
        }
    } catch (error) {
        console.log("ERRO AL ENVIAR CORREOS");

    }

}

function limpiarObservaciones(arrayObservaciones){
        const seen = {};
        const uniqueArray = [];
    
        for (const item of arrayObservaciones) {
            if (!seen[item]) {
                uniqueArray.push(item);
                seen[item] = true;
            }
        }
    
        return uniqueArray;
}

function generarFilasCsvEstudiantes(contentJson){
    try {
        console.log(contentJson);
        let filas =`nombre_completo,identidad,carrera_principal,correo_personal,id_centro`;
        let email;
        let r;
        /**recorrer resultados para enviar: */
        for (resultado of contentJson){
            r = Object.values(resultado)[0];
            console.log(`FILA::::`,r);
            /**enviar correo a cada uno */
            filas += `\n${generateFilaEstudiante(r.informacion)}`;
            
            //correo.enviarCorreo(email,'RESULTADOS UNAH ADMISION',mensaje);
        }
        return filas;
        console.log('FIN::\n',filas);
    } catch (error) {
        console.log("ERRO AL GENERAR FILAS para csv");   
    }

}

function generateFilaEstudiante(p) {
    return `${p.primer_nombre} ${p.segundo_nombre} ${p.primer_apellido} ${p.segundo_apellido}, ${p.id_persona},${[p.carrerasAprobadas][0]}, ${p.correo},${p.id_centro}`;
}

/**revisa si el estudiante aprobo para una o ambas carreas, o si reprobo para ambas.
 * En cualquier caso manda el correo informando los resultados
 */
async function evaluarAspirantes(){
    try{
        var aprobados = {}, reprobados={};
        //var msjs = [];

        //await db.connect();
        
        /** lista de aspirantes que hicieron examen de admision*/
        let listaAspirantesId_conExamenes = await db.query(`select distinct a.id_persona from aspirantes a inner join resultados_examen_admision rea on a.id_aspirante = rea.id_aspirante;`);
        
        console.log(':::LISTA:::',listaAspirantesId_conExamenes);

        /**recorriendo la lista de aspirantes con examen de admision */
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
            let r='';
            /**si existe la carrera a la que concurso */
            if(id){
                /** se manda a llamar el P.A para crear el estudiante con la carreraPrincipal */
                r = await db.query(`[dbo].[agregar_estudiante] @numIdentidad = '${id_persona_aprobado}', @id_carrera = ${id}`);
            }
            console.log("////////// resultado de agregar estudiante",r);
            console.log(await db.query(`select * from estudiantes where id_persona = '${id_persona_aprobado}'`));

            /**enviar correo de aprobacion */
            // Consulta para agregar al estudiante y obtener su número de cuenta y correo institucional
            let estudianteInfo = await db.query(`SELECT num_cuenta, correo_institucional FROM estudiantes WHERE id_persona = '${id_persona_aprobado}'`);
            let numCuenta = estudianteInfo[0].num_cuenta;
            let correoInstitucional = estudianteInfo[0].correo_institucional;

            let infoPersonaArray = await db.query(`select * from personas p where p.numero_identidad='${id_persona_aprobado}'`);
            let jsonPersona = infoPersonaArray[0];
            
            let email = jsonPersona.correo;
            console.log("CORREO PERSONA para enviar correo:",email);
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
            correo.enviarCorreo(email,'RESULTADOS EXAMENES UNAH ',msjPersonalizado);
        }
        
        
        /** eliminarlos de la tabla aspirantes y pasarlos a la tabla estudiante */
        

        /* eliminarlos de la tabla resultados_examen_admision y pasarlos a un historial o algo asi de examenes o Eliminarlos permanentemte */

    }catch (error){
        console.error("ocurrio un error al evaluar aspirantes");
    }finally{
        await db.close();
    }
}
/**guarda en existentes los aspirantes recibidos de las notas que si se encuentran en la tabla aspirantes */
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

async function evaluarNotas(notasAspirantesExistentes){
    try {
        
        
        var requisitosCarreras = await generarArbolRequisitosCarreras();
        let status = false;
        //await db.connect();
        
        /**obteniendo toda la informacion de una persona para luego informarle si paso o no */
        var infoPersonas = [];
        var estudiantesAprobados = [];
        var estudiantesReprobados = [];
        var result = {};
        var carrerasAprobadas = [];

        var a = [];
        var r = [];
        

        for (notaJson of notasAspirantesExistentes){
            let infoPersona = await db.query(`select * from aspirantes a inner join personas p on p.numero_identidad = a.id_persona where p.numero_identidad = '${notaJson.id}';`);
            console.log('= = = = = ');
            console.log(infoPersona[0],notaJson);
            console.log('= = = = = ');
            infoPersona = infoPersona[0];
            
            
            /**comprar si paso carreraPrincipal */
            let resultadoCarreraPrincipal = await evaluarCarrera(infoPersona.carrera_principal,notaJson,requisitosCarreras);
            /**comprar si paso la carrerra Secundaria */
            let resultadoCarreraSecundaria = await evaluarCarrera(infoPersona.carrera_secundaria,notaJson,requisitosCarreras);

            
            /**guardando carreras */
            let principal;
            




            infoPersona.carrerasAprobadas = [];
            
            /** */
            

            /** */
            if(resultadoCarreraPrincipal.status){
                console.log(`El estudiante ${infoPersona.id_persona} aprobo su Carrera Principal`);
                //status = true;
                result = { [infoPersona.numero_identidad]: resultadoCarreraPrincipal };
                result[infoPersona.id_persona].informacion = infoPersona;
                
                infoPersona['carrerasAprobadas'].push(resultadoCarreraPrincipal.carrera);

                estudiantesAprobados.push(result);
            }else{
                console.log(`El estudiante ${infoPersona.id_persona} REPROBO su Carrera Principal`);
                //status = false;
                result = { [infoPersona.numero_identidad]: resultadoCarreraPrincipal };
                result[infoPersona.id_persona].informacion = infoPersona;
                estudiantesReprobados.push(result);
            }
            console.log("resultado CARRERA PRINCIPAL==::::==",resultadoCarreraPrincipal);
            console.log(result.observaciones);

            

            /**comprar si paso la carrerra Secundaria */
            
            if(resultadoCarreraSecundaria.status){
                console.log(`El estudiante ${infoPersona.id_persona} aprobo su Carrera Principal`);
                //status = true;
                result = { [infoPersona.numero_identidad]: resultadoCarreraSecundaria };
                result[infoPersona.id_persona].informacion = infoPersona;
                infoPersona['carrerasAprobadas'].push(resultadoCarreraSecundaria.carrera);
                estudiantesAprobados.push(result);
            }else{
                console.log(`El estudiante ${infoPersona.id_persona} REPROBO su Carrera Principal`);
                //status = false;
                result = { [infoPersona.numero_identidad]: resultadoCarreraSecundaria };
                result[infoPersona.id_persona].informacion = infoPersona;
                estudiantesReprobados.push(result);
            }
            console.log("resultado carrera Secundaria ==::::==",resultadoCarreraSecundaria);








            let info ='';
            if(resultadoCarreraPrincipal.status){
                principal =  resultadoCarreraPrincipal.carrera;
                info = resultadoCarreraPrincipal.observaciones;
            }else{
                if(resultadoCarreraSecundaria.status){
                    principal = resultadoCarreraSecundaria.carrera;
                    info = resultadoCarreraSecundaria.observaciones;
                }
            }

            if(principal){
                a.push({
                    [infoPersona.id_persona]:infoPersona,
                    'carreraPrincipal':principal,
                    'informacion': info
                });
            }else{
                r.push({
                    [infoPersona.id_persona]:infoPersona,
                    'carreraPrincipal':principal,
                    'informacion': info
                })
            }
            

            
            
            
        }
        console.log(":::::::: APROBADOS Y REPROBADOS FINALES = = = =");
        console.log('aprobados - - - : ', estudiantesAprobados)
        console.log('reprobados - - - : ', estudiantesReprobados)
        console.log("= = = = = APROBADOS Y REPROBADOS FINALES :::::",a);
        //await db.close();
        //for (infoP of infoPersonas){}

        let respuestaFinalRouter = {};

        return {
            "msj":"Se evaluaron los examenes",
            "aprobados": estudiantesAprobados,
            "reprobados": estudiantesReprobados,
            "a":a,
            "r":r
        };
        

    } catch (error) {
        console.log('ocurrio un error al evaluar notas');
        //console.error(error);            
        return {
            "msj":"ERROR Al EVALUAR notas",
            "result": null
        };
    }

}

async function obtenerTreeNombresExamenes() {
    try {
        // Ejecutar la consulta y esperar los resultados
        let resultados = await db.query('SELECT id_tipo_examen, nombre_examen FROM tipos_examen_admision');

        // Procesar los resultados para crear el JSON deseado
        let examenesJson = {};
        resultados.forEach(row => {
            examenesJson[row.id_tipo_examen] = row.nombre_examen;
        });

        console.log(examenesJson);
        return examenesJson;
    } catch (error) {
        // Manejar cualquier error que ocurra durante la consulta
        console.error("Error al obtener nombres de examenes: ");//, error);
        throw error; // Lanzar el error para que pueda ser manejado por el llamador
    }
}


async function evaluarCarrera(idCarrera,notaJson, treeRequisitos){
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
    console.log(idCarrera,notaJson,treeRequisitos);
    let treeNombresExamenes = await obtenerTreeNombresExamenes();
    
    console.log(`- - - - - - - - - - - -notaJson.tipoExamen::: ${notaJson.tipoExamen} - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - `);
    let requisitosJson = treeRequisitos[idCarrera];
    let status = true;
    let msj = '';
    let resuladosEvaluaciones = [];
    let carreraAprobada = {};
    let carreraReprobada = {};
    //let examenesAprobados = {};

    console.log("requisitosJson = = = = = = = = = = - - - - - -",requisitosJson);
    
    
    /**recorrer los requisitos segun la carrera */
    for (let requisito in requisitosJson){

        console.log("requisito = = = = ",requisito);
        if(requisitosJson[notaJson.tipoExamen]){
            //msj = `El estudiante con identidad numero ${notaJson.id}, realizo todos los examenes ${nombresCarreras[idCarrera]}`;
            msj = `Le informamos que usted, realizo todos los examenes ${nombresCarreras[idCarrera]}`;
        } else{
            msj = `Le informamos que usted, *NO HIZO* todos los examenes para la carrera ${nombresCarreras[idCarrera]}`;
             status = false;
        }
        resuladosEvaluaciones.push(msj);
        if ( requisitosJson[requisito] < notaJson.nota ){
            console.log('aprobo');
            msj = `Le informamos que usted, aprobo el examen de ${treeNombresExamenes[notaJson.tipoExamen]} con una calificion de ${notaJson.nota} siendo la nota minima requerida de ${requisitosJson[requisito]} `;//${requisitosJson[notaJson.tipoExamen]}
            if(status){
                carreraAprobada[idCarrera] = notaJson.nota;
            }
        }else{
            status = false;
            msj = `Le informamos que usted, REPROBO el examen de ${treeNombresExamenes[notaJson.tipoExamen]} con una calificion de ${notaJson.nota} siendo la nota minima requerida de ${requisitosJson[requisito]} `;
            console.log('reprobo');
            if(status){
                carreraReprobada[idCarrera] = notaJson.nota;
            }
        }
        resuladosEvaluaciones.push(msj);
        console.log("COMPARACION DE CARRERA ", requisitosJson[notaJson.tipoExamen], notaJson.nota)


    }

    /**comprobar si tiene todos los requisitos */
    /**comprobar si aprobo el requisito */
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
    
    console.log(resuladosEvaluaciones);
    
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
    console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ');
    

    return {
        'carrera':idCarrera,
        "status":status,
        "observaciones":resuladosEvaluaciones
    };
}

var nombresCarreras = {};

async function generarArbolRequisitosCarreras(){
    //await db.connect();
    var listaCarrerasJson = await db.query(`select * from carreras;`);
    
    console.log(listaCarrerasJson);

    var treeRequisitos = {};


    for (let id_carreraJson of listaCarrerasJson){
        console.log(id_carreraJson);
        nombresCarreras[id_carreraJson.id_carrera] = id_carreraJson.nombre_carrera; 
        treeRequisitos[id_carreraJson.id_carrera] =  extractRequisitos(
            await db.query(`select id_tipo_examen, puntaje_minimo_examen from requisitos_carreras where id_carrera = ${id_carreraJson.id_carrera};`)
        );
    }

    console.log('treeRequisitosCarreras',treeRequisitos);
    //console.log(listaRequisitosCarreras)
    //await db.close();
    return treeRequisitos;
}

function extractRequisitos(jsonTipoExamen){
    //console.log('??????????? jsonTipoExamen::',jsonTipoExamen);
    let requisitos = {};
    for (requisitoJson of jsonTipoExamen ){
        requisitos[requisitoJson.id_tipo_examen] = requisitoJson.puntaje_minimo_examen ;
    }
    console.log(requisitos);
    return requisitos;
};


//evaluarAspirantes();
/**y se exporta todo el objeto completo.*/
module.exports = router;
