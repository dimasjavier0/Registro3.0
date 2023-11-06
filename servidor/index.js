const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');


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

/**Recibir Peticiones */
app.get('/', (req, res) => {
    console.log("HELLO WORLD");
    res.send("HELLO WORLD");
});

/**Levantando Servidor Backend */
app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});