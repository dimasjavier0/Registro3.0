const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
//var Routes = require('./routes');
var aspirantes_router = require("./routes/aspirantes_route");

var db = require('./controllers/database');
const nodemailer = require('nodemailer');





/**configuraciones */
    const PORT = process.env.PORT || 8888; //puerto para levantar

    /**instancia del modulo express*/
    const app = express();
    app.set('port', PORT);

    /** permite peticiones de otros origenes.*/
    app.use(cors()); 
    //app.use(express.static('public')); //busca la direccion que recibe en la carpeta public.


    /** Para Recibir Peticiones en formato JSON */
    app.use(express.json());
    /**Recibir una Peticion POST */
    app.use(bodyParser.json());
    /** con esto tenemos acceso a un nuevo JSON llamado body*/
    app.use(bodyParser.urlencoded({extended:true})); 
    /**para el manejo de rutas */
    //app.use(Routes);


/**Recibir Peticiones */
app.get('/', (req, res) => {
    console.log("HELLO WORLD");
    res.send("HELLO WORLD");
});

/**
 * RF1: GUARDAR UN ASPIRANTE
 * mandar peticion a la base de datos para guardar el aspirante
 * el  router aspirantes_route gestiona todas las peticiones se /aspirantes */
//app.use("/aspirantes",aspirantes_router.post);

app.post(
    '/notas', async (req,res)=>{
        //exec [dbo].[subir_nota_estudiante] '0801200005002', 2, 1050
        /** recibe peticion(aspirante) */
    
    /** notas es una arreglo de notas [[,,],[]]*/
    console.log("peticion Recibida:",req.body);
    let notas = req.body.csvData;//arreglo de JSONs

    /**Loguear */
    await db.setConfigToLogin('asd','1234');

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
    }
);


async function leerNotasString(notasString){
    let datos = {
        validos: [],
        invalidos: []
      };
    
      let data = notasString; // Leer el archivo sincrónicamente
      let lineas = data.split('\n'); // Dividir el contenido del archivo en líneas
      for (let linea of lineas) {
        let [identidad, tipoExamen, nota] = linea.split(','); // Separar cada línea por comas
    
        // Procesar y validar la identidad del estudiante
        identidad = identidad.replace(/-/g, ''); // Quitar guiones
        if (identidad.length <= 13 && /^\d+$/.test(identidad)) { // Validar la longitud y el contenido de la identidad
          tipoExamen = parseInt(tipoExamen, 10); // Convertir a entero
          nota = parseFloat(nota); // Convertir a flotante
    
          // Validar que el tipo de examen y la nota sean correctos
          if (tipoExamen >= 1 && tipoExamen <= 3 && !isNaN(nota)) {
            datos.validos.push([identidad, tipoExamen, nota]); // Agregar a la lista de datos válidos
          } else {
            datos.invalidos.push(linea); // Agregar a la lista de datos inválidos
          }
          
        } else {
          datos.invalidos.push(linea); // Agregar a la lista de datos inválidos
        }
      }
      return datos; // Devolver los datos procesados
}

async function leerYProcesarCSV(nombreArchivo) {
    let data = fs.readFileSync(nombreArchivo, 'utf8'); // Leer el archivo sincrónicamente
    return leerNotasString(data);
}


app.post('/aspirantes', async (req,res)=>{ //funcion asincrona
  
    /** recibe peticion(aspirante) */
    var aspirante = req.body;

    console.log(req.params);
    console.log(req.body);

    /**Loguear */
    await db.setConfigToLogin('asd','1234');

    /** Hacer conexion */
    await db.connect();
    
    console.log(aspirante.imagen);

    /** Limpiar campos del aspirante antes de enviar a la base de datos */

    /** Mandar a guardar aspirante en la base de datos*/
    var resultQuery = await db.query(
      `exec [dbo].[agregar_aspirante] '${aspirante.identidad}', '${aspirante.p_nombre}', '${aspirante.s_nombre}', '${aspirante.p_apellido}', '${aspirante.s_apellido}'
      ,'${aspirante.cel}',  '${aspirante.correoPersonal}',${aspirante.carreraPrincipal},${aspirante.carreraSecundaria}, 
      ${aspirante.centroRegional},${aspirante.estado};`
    );

    


    /** ver respuesta de db */
    //console.log(result);
    await db.close();

    /** se recibe los requisitos del aspirante */
    console.log('REcibiendo Aspirante:',req.body);
    
    /** mandar respuesta de confirmacion */
    res.send(
        {
          'aspirante recibido':aspirante,
          'respuesta': resultQuery
        }
    );


});



/**Levantando Servidor Backend */
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
    
});