const sql = require('mssql');

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

const obtenerNombresCentros = async () => {
    try {

    await sql.connect(config);

    // Consulta  para obtener los nombres de los centros
    const result = await sql.query`SELECT * FROM centros_regionales`;
    return result.recordset;

    } catch (error) {
    throw error;
    } finally {
    await sql.close();
    }
};

module.exports = { obtenerNombresCentros };
