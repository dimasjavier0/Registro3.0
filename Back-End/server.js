const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var aspirantesRouter = require("./routes/aspirantes_route");

// Importa los routers de tus módulos
var generacionCorreosRouter = require('./ruta/a/generacion_de_correos'); // Ajusta esta ruta
var estudiantesRouter = require('./ruta/a/estudiantes'); // Ajusta esta ruta

var db = require('./controllers/database');

/** Configuraciones */
const PORT = process.env.PORT || 8888; // Puerto para levantar

/** Instancia del módulo express */
const app = express();
app.set('port', PORT);

/** Permite peticiones de otros orígenes. */
app.use(cors()); 

/** Para recibir peticiones en formato JSON */
app.use(express.json());

/** Recibir una petición POST */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true})); 

// Usa los routers importados
app.use('/generacionCorreos', generacionCorreosRouter);
app.use('/estudiantes', estudiantesRouter);

/** Recibir peticiones */
app.get('/', (req, res) => {
    console.log("HELLO WORLD");
    res.send("HELLO WORLD");
});

/**
 * RF1:
 * Mandar petición a la base de datos para guardar el aspirante.
 * El router aspirantes_route gestiona todas las peticiones de /aspirantes.
 */
app.use("/aspirantes", aspirantesRouter);

/** Levantando servidor backend */
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});
