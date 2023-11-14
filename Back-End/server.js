const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
//var Routes = require('./routes');
var aspirantes_router = require("./routes/aspirantes_route");

var db = require('./controllers/database');





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
    
    let notas = req.body;//leerNotasString(req.body.notas);

    /**Loguear */
    await db.setConfigToLogin('asd','1234');

    /** Hacer conexion */
    await db.connect();
    
    console.log("notas Recibidas:",notas);

    /** Limpiar campos del aspirante antes de enviar a la base de datos */

    /** Mandar a guardar aspirante en la base de datos*/
    /*var resultQuery = await db.query(
      `exec [dbo].[agregar_aspirante] '${aspirante.identidad}', '${aspirante.p_nombre}', '${aspirante.s_nombre}', '${aspirante.p_apellido}', '${aspirante.s_apellido}'
      ,'${aspirante.cel}',  '${aspirante.correoPersonal}',${aspirante.carreraPrincipal},${aspirante.carreraSecundaria}, 
      ${aspirante.centroRegional},${aspirante.estado};`
    );*/

    /** ver respuesta de db */
    //console.log(result);
    await db.close();

    
    /** mandar respuesta de confirmacion */
    res.send(
        {
          'notas recibidas':notas,
          'respuesta': 'resultQuery'
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