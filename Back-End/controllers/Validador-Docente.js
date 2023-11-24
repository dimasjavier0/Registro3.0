/*async function validarDocente(Identidad, numeroEmpleado) {
    try {
        let pool = await sql.connect(dbConfig);
        // Verificar la identidad en la tabla Personas
        const resultadoIdentidad = await pool.request()
            .input('Identidad', sql.NVarChar, Identidad)
            .query('SELECT * FROM personas WHERE numero_identidad = @Identidad');

        if (resultadoIdentidad.recordset.length > 0) {
            return true; // La identidad ya existe
        }

        // Verificar el número de empleado en la tabla Docentes
        const resultadoNumeroEmpleado = await pool.request()
            .input('NumeroEmpleado', sql.Int, numeroEmpleado)
            .query('SELECT * FROM docentes WHERE num_empleado = @NumeroEmpleado');

        return resultadoNumeroEmpleado.recordset.length > 0; // true si el número de empleado ya existe
    } catch (err) {
        console.error('Error al validar el docente:', err);
        throw err;
    } finally {
        sql.close();
    }
}
*/
/*
const dbConfig = {
    user: 'asd',
    password: '134',
    server: 'localhost', 
    database: 'registro',
    options: {
        encrypt: false, // 
        trustServerCertificate: true // Solo para desarrollo, no usar en producción
    }
};

sync function validarDocente(Identidad, numeroEmpleado) {
    try {
    let pool = await sql.connect(dbConfig);
    let resultado = { identidadExiste: false, numeroEmpleadoExiste: false };

    // Verificar si la identidad ya existe
    const resultadoIdentidad = await pool.request()
        .input('Identidad', sql.NVarChar, Identidad)
        .query('SELECT COUNT(*) AS count FROM personas WHERE numero_identidad = @Identidad');

    if (resultadoIdentidad.recordset[0].count > 0) {
        resultado.identidadExiste = true;
    }

    // Verificar si el número de empleado ya existe
    const resultadoNumeroEmpleado = await pool.request()
        .input('NumeroEmpleado', sql.Int, numeroEmpleado)
        .query('SELECT COUNT(*) AS count FROM docentes WHERE num_empleado = @NumeroEmpleado');

    if (resultadoNumeroEmpleado.recordset[0].count > 0) {
        resultado.numeroEmpleadoExiste = true;
    }

    return resultado;
} catch (error) {
    console.error('Error al validar el docente:', error);
    throw error; // O manejar el error de manera adecuada
} finally {
    await sql.close();
}
}*/
// controllers/ValidadorDocente.js
const sql = require('mssql');

const dbConfig = {
  user: 'asd',
  password: '134',
  server: 'localhost',
  database: 'registro',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function validarDocente(Identidad, numeroEmpleado) {
  try {
    const pool = await sql.connect(dbConfig);

    // Verificar si la identidad ya existe
    const resultadoIdentidad = await pool
      .request()
      .input('Identidad', sql.NVarChar, Identidad)
      .query('SELECT COUNT(*) AS count FROM personas WHERE numero_identidad = @Identidad');

    // Verificar si el número de empleado ya existe
    const resultadoNumeroEmpleado = await pool
      .request()
      .input('NumeroEmpleado', sql.Int, numeroEmpleado)
      .query('SELECT COUNT(*) AS count FROM docentes WHERE num_empleado = @NumeroEmpleado');

    return {
      identidadExiste: resultadoIdentidad.recordset[0].count > 0,
      numeroEmpleadoExiste: resultadoNumeroEmpleado.recordset[0].count > 0,
    };
  } catch (error) {
    console.error('Error al validar el docente:', error);
    throw error;
  } finally {
    await sql.close();
  }
}

module.exports = { validarDocente };
