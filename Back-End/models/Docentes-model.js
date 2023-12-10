const sql = require('mssql');
const {UserAndLogin} = require('../controllers/loginUsers');

//Configuración de la conexión a la base de datos
const dbConfig = {
    user: 'Grupo', 
    password: '1234',
    server: 'localhost',
    database: 'Registro2',
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

        const imageBuffer = Buffer.from(docenteData.fotografia.split(',')[1], 'base64');
        // Ejecutar el procedimiento almacenado
        await pool.request()
            .input('Identidad', sql.NVarChar, docenteData.Identidad)
            .input('PrimerNombre', sql.NVarChar, docenteData.primerNombre)
            .input('SegundoNombre', sql.NVarChar, docenteData.segundoNombre)
            .input('PrimerApellido', sql.NVarChar, docenteData.primerApellido)
            .input('SegundoApellido', sql.NVarChar, docenteData.segundoApellido)
            .input('Correo', sql.NVarChar, docenteData.correo)
            .input('NumeroEmpleado', sql.Int, docenteData.numeroEmpleado)
            .input('Foto', sql.VarBinary,imageBuffer)
            .input('DeptoAcademicoId', sql.Int, docenteData.departamento)
            .input('CentroId', sql.Int, docenteData.centroRegional)
            .execute('RegistrarDocente');

        //Crear el usuario en la base de datos
        const userLogin = new UserAndLogin();
        await userLogin.crearUsuario(docenteData.numeroEmpleado, docenteData.correo, '3');
        
        console.log('Docente registrado con éxito');
    } catch (err) {
        console.error('Error al registrar el docente:', err);
        throw err;
    } finally {
        sql.close();
    }
}

module.exports = { registrarDocente };
