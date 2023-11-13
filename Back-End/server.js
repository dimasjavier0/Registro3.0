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
 * RF1:
 * mandar peticion a la base de datos para guardar el aspirante
 * el  router aspirantes_route gestiona todas las peticiones se /aspirantes */
//app.use("/aspirantes",aspirantes_router.post);

app.post('/aspirantes', async (req,res)=>{ //funcion asincrona
  
  /** recibe peticion(aspirante) */
  var aspirante = req.body;

  /**Loguear */
  await db.setConfigToLogin('asd','1234');

  /** Hacer conexion y guardar en base de datos */
  await db.connect();
  var result = db.query('select * from carreras;');
  /** ver respuesta de db */
  console.log(result);
  await db.close();

  /** se recibe los requisitos del aspirante */

  
  /** mandar respuesta de confirmacion */
  res.send(
      {
        'aspirante recibido':aspirante,
        'respuesta': result
      }
  );
});



/**Levantando Servidor Backend */
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});