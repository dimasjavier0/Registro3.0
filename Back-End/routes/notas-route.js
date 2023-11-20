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

        /** notas es una arreglo de notas [[,,],[]]*/
        console.log("peticion Recibida:",req.body);
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

        
        /**subir notas de los aspirantes que si existen */
        for (let notaJSON of existentes){
            await db.query(
                `exec [dbo].[subir_nota_estudiante] '${notaJSON.id}', ${notaJSON.nota}, ${notaJSON.tipoExamen};`
            );
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

    } catch (error) {
        console.log("::OCURRRIO UN ERROR::",error);
    }
});

/**revisa si el estudiante aprobo para una o ambas carreas, o si reprobo para ambas.
 * En cualquier caso manda el correo informando los resultados
 */
async function evaluarAspirantes(){
    await db.connect();
    
    /** lista de aspirantes que hicieron examen de admision*/
    let listaAspirantesId_conExamenes = await db.query(`select distinct a.id_persona from aspirantes a inner join resultados_examen_admision rea on a.id_aspirante = rea.id_aspirante;`);
    
    for (let aspiranteId of listaAspirantesId_conExamenes){
        let requisitoAspiranteCarrera_P = await db.query();
        let requisitoAspiranteCarrera_S = await db.query();
        let resultado;
    }
    /**obtengo los resultados en base a los requisitos de las carreras del estudiante */
    /**enviar correo con los resultados */

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



/**y se exporta todo el objeto completo.*/
module.exports = router;