const express = require('express');
const sql = require('mssql'); // Asumiendo que estás usando mssql para la conexión
const router = express.Router();

// Configuración de la conexión a la base de datos
const dbConfig = {
    user: 'asd',
    password: '1234',
    server: 'localhost',
    database: 'Registro2',
    // Otras opciones de configuración...
};

// Endpoint para activar la matrícula
router.post('/activar-matricula', async (req, res) => {
    try {
        //const { id_PAC, descripcion } = req.body;
        await sql.connect(dbConfig);
        await sql.query`EXEC ActivarMatriculaFF`;
        res.status(200).send('Proceso de matrícula activado con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al activar el proceso de matrícula');
    }
});

module.exports = router;
