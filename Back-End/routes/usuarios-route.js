//http://localhost:5176/olvideContrase%C3%B1a
//ruta con la que conecto a react
//agregar al server con la misma estructura de cristian rodil 

const express = require('express');
const router = express.Router();
const usuarios = require('../controllers/usuarios');






/* no hay clase, se importa la funcion*/
//const correoRecuperacion = require('../controllers/CorreoRecuperacion');

console.log("= = = = entro al router = = = = =");
//correo.enviarCorreo('papardosmith1917@gmail.com','Hola Pavel, la clase correo si Funciona');

// Cambia la ruta para que coincida con la URL proporcionada
// Asegúrate de que la URL está correctamente codificada y usa 'olvideContrasena'
router.put('/usuarios', usuarios.manejarSolicitudRecuperacion);


//console.log("X X X salio del router X X X");
module.exports = router;