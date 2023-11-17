
const sql = require('mssql');
const express = require('express');
const router = express.Router();

// Configuración de la conexión a la base de datos
const config = {
    user: 'tuUsuario',
    password: 'tuContraseña',
    server: 'tuServidor',
    database: 'tuBaseDeDatos',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Función para ejecutar el procedimiento almacenado
async function agregarEstudiante(numIdentidad, idCarrera, idDireccion, correoPersonal, idCentro) {
    try {
        await sql.connect(config);

        const request = new sql.Request();
        request.input('numIdentidad', sql.NVarChar(13), numIdentidad);
        request.input('idCarrera', sql.Int, idCarrera);
        request.input('idDireccion', sql.Int, idDireccion);
        request.input('correoPersonal', sql.NVarChar(100), correoPersonal);
        request.input('idCentro', sql.Int, idCentro);

        await request.execute('agregar_estudiante');
    } catch (err) {
        throw err;
    }
}

// Definir el endpoint de la API
router.post('/agregarEstudiante', async (req, res) => {
    const { numIdentidad, idCarrera, idDireccion, correoPersonal, idCentro } = req.body;
    try {
        await agregarEstudiante(numIdentidad, idCarrera, idDireccion, correoPersonal, idCentro);
        res.status(200).send('Estudiante agregado con éxito');
    } catch (err) {
        res.status(500).send('Error al agregar el estudiante: ' + err.message);
    }
});

module.exports = router;
