const sql = require('mssql');

// Configuración de la conexión a la base de datos
const dbConfig = {
    user: 'asd',
    password: '134',
    server: 'localhost', 
    database: 'registro',
    options: {
        encrypt: false, // Si estás usando Azure SQL
        trustServerCertificate: true // Solo para desarrollo, no usar en producción
    }
};

// Función para registrar un docente
async function registrarDocente(docenteData) {
    try {
        // Conectar a la base de datos
        let pool = await sql.connect(dbConfig);

        // Ejecutar el procedimiento almacenado
        await pool.request()
            .input('Identidad', sql.NVarChar, docenteData.Identidad)
            .input('PrimerNombre', sql.NVarChar, docenteData.primerNombre)
            .input('SegundoNombre', sql.NVarChar, docenteData.segundoNombre)
            .input('PrimerApellido', sql.NVarChar, docenteData.primerApellido)
            .input('SegundoApellido', sql.NVarChar, docenteData.segundoApellido)
            .input('Correo', sql.NVarChar, docenteData.correo)
            .input('NumeroEmpleado', sql.Int, docenteData.numeroEmpleado)
            .input('Foto', sql.VarBinary(sql.MAX), Buffer.from(docenteData.fotografia, 'base64'))
            .input('DeptoAcademicoId', sql.Int, docenteData.departamento)
            .input('CentroId', sql.Int, docenteData.centroRegional)
            .execute('RegistrarDocente');

        console.log('Docente registrado con éxito');
    } catch (err) {
        console.error('Error al registrar el docente:', err);
        throw err;
    } finally {
        sql.close();
    }
}

module.exports = { registrarDocente };
