
const sql = require('mssql');

const dbConfig = {
  user: 'Grupo',
  password: '1234',
  server: 'localhost',
  database: 'Registro2',
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
      .query(`
      SELECT COUNT(*) AS count
      FROM personas AS p
      JOIN docentes AS d ON p.id_persona = d.id_persona
      WHERE p.numero_identidad = @Identidad
  `);

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
