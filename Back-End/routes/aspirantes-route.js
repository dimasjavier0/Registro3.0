/**aqui es igual que el index casi.
 * pero no se utiliza la variable app.
 * SOLO:
*/
var express = require('express');
var aspirantesModel = require('../models/aspirantes-model');
const { Result } = require('postcss');
var router = express.Router(); // en lugar de app usar router.
//var db = require('../conections/database');

/**Obtener aspirantes */
router.get('/',(req,res)=>{});

/**Obtener 1 aspirante */
router.get('/:idAspirante',(req,res)=>{
    console.log('se recibio:',req.body);
});
//C:\Program Files\OpenSSL-Win64
/**Crear 1 aspirante */
router.post('/', async (req,res)=>{
  
  console.log('peticion Recibida:',req.body);
  aspiranteJson = req.body;
  
  let result = await aspirantesModel.createAspirante(aspiranteJson); 
  /** crear en la base de datos, internamente tiene que hacer la validacion */
  if (result){
    
    console.log(`aspirante Creado:`, result);

    /**enviar respuesta */
    res.send(
      result
      /*{
        'msj': result.msj,
        'respuesta': result.result
      }*/
    );  
  }else{
    res.send(
      result/*{
        'msj':result.msj,
        'respuesta':result.result
        
      }*/
    );
  };
});

  /**Crear varios aspirantes */
router.post('/', async (req,res)=>{
        
    /** notas es una arreglo de notas [[,,],[]]*/
    console.log("peticion Recibida:",req.body);
    let notas = req.body.csvData;//arreglo de JSONs

    /**Loguear */
    await db.setConfigToLogin('Grupo','1234');

    /** Hacer conexion */
    //await db.connect();
    
    console.log("notas Recibidas:",notas);
    
    var datos = {"validos":[],"invalidos":[]};

    

    /**Recorrer cada nota del estudiante */
      notas.forEach( async notaJSON => {
           /** Mandar a guardar la nota en la base de datos*/
          await db.connect();
          let resultQuery = await db.query(
            `exec [dbo].[subir_nota_estudiante] '${notaJSON.id}', ${notaJSON.nota}, ${notaJSON.tipoExamen};`
          );
          await db.close();
      });
   


      /** ver las notas de los estudiantes */
      await db.connect();
      let resultadosEstudiantes = await db.query(`select a.id_persona, nota, id_tipo_examen, p.correo from resultados_examen_admision rea
      inner join aspirantes a on a.id_persona = rea.id_persona
      inner join personas p on p.numero_identidad= a.id_persona; `);
      await db.close();

      console.log("resultadosEstudiantes:",resultadosEstudiantes);

      var estudiantesAprobadosDobles = [];
      var estudiantesAprobados = [];
      var estudiantesReprobados = [];

      await db.connect();        
      /**ver si aprobaron cada uno de los estudiantes*/
        resultadosEstudiantes.forEach(async (jsonResultado)=>{
        /**ver requerimiento del estudiante */
        

        //var requisitosEstudiante = await db.query(`exec [dbo].[requisitos_para_pasar_de_id_persona] '${jsonResultado.id_persona}'`);
        var carrerasAprobadas=[];
        
        /*requisitosEstudiante.array.forEach(jsonRequisito => {
          if (jsonRequisito.nota>= jsonRequisito.puntaje_minimo_examen){
              carrerasAprobadas.push(jsonRequisito.id_carrera);
          };
        });*/

       
        
        /**clasificando si aprobo o reprobo ambas, una o ninguna carrera */
        switch (carrerasAprobadas.length) {
          case 0:
            estudiantesReprobados.push(jsonResultado.id_carrera);
            break;
          case 1:
            estudiantesAprobados.push(jsonResultado.id_carrera);
          break;
          case 2:
            estudiantesAprobados.push(jsonResultado.id_carrera);
          break;
          default:
            break;
        };

        console.log(estudiantesReprobados,estudiantesAprobados,estudiantesAprobadosDobles);


        /**mandar correo de confirmacion de resultados */
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'idsunahcu@gmail.com',
            pass: 'kqqh vbjf chrh ygsm'
          }
        });
        
        const mailOptions = {
          from: 'idsunahcu@gmail.com',
          to: `${jsonResultado.correo}`,
          subject: 'RESULTADOS EXAMENES ADMISION UNAH',
          text: `Hola muy buenas, sus resultados son: `
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Correo enviado: ' + info.response);
          }
        });      




      });
      //await db.close();
      
      //await db.close();
      
      
    
      //await db.connect();
      //let text = await db.query(`select p.correo from personas p where p.id_persona = ${jsonEstudiante.id_persona}`);
      //await db.close();
      
      
      /** mandar respuesta de confirmacion al cliente*/
      res.send(
          {
            'notas recibidas':notas,
            'respuesta': datos
          }
      );


});

/**actualizar un aspirante */
router.put('',(req,res)=>{});

/** borrar un aspirante */
router.delete('',(req,res)=>{});
//...

//ahora esta todo encapsulado aqui.

/**y se exporta todo el objeto completo.*/
module.exports = router;

