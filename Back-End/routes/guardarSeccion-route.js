const express = require('express');
const router = express.Router();
const mssql = require('mssql');


const config = {
    user: 'Grupo',
    password: '1234',
    server: 'localhost',
    database: 'Registro2',
    options: {
    encrypt: false,
    trustServerCertificate: true,
    }
};

router.post('/', async (req, res) => {
    try {
        await mssql.connect(config);

        const { asignaturaId, numEmpleado, aulaId, horaInicio, horaFin, dias, cupos } = req.body;

        const result = await mssql.query(`
            INSERT INTO secciones (id_asignatura, id_docente, id_aula, hora_inicio, hora_fin, dias, cupos_maximos)
            VALUES ('${asignaturaId}', '${numEmpleado}', '${aulaId}', '${horaInicio}', '${horaFin}', '${dias}', '${cupos}');
        `);

        res.status(200).json({ message: 'Sección creada con éxito' });
    } catch (error) {
        console.error('Error al crear la sección:', error);

        res.status(500).json({ message: 'Error al crear la sección. Por favor, inténtelo de nuevo.' });
    } finally {
        await mssql.close();
    }
});

module.exports = router;
