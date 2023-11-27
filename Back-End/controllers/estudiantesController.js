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

async function getEstudianteByNumeroCuenta(req, res) {
    try {
    const pool = await mssql.connect(config);
    const result = await pool
        .request()
        .input('numeroCuenta', mssql.NVarChar, req.params.numeroCuenta)
        .query(`
        SELECT
        per.primer_nombre,
        per.segundo_nombre,
        per.primer_apellido,
        per.segundo_apellido,
        per.correo,
        est.correo_institucional,
        car.nombre_carrera
        FROM
        estudiantes est
        INNER JOIN personas per ON est.id_persona = per.numero_identidad
        INNER JOIN carreras car ON est.id_carrera = car.id_carrera
        WHERE
        est.num_cuenta = @numeroCuenta;
    `);

    if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    const estudiante = result.recordset[0];
    res.json(estudiante);
    } catch (error) {
    console.error(error);
    res.status(500).send('Error del servidor');
    }
}

module.exports = {
    getEstudianteByNumeroCuenta,
};
