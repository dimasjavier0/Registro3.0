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

class DepartamentosModel {
    async getAllDepartamentos() {
        try {
            const pool = await mssql.connect(config);
            const result = await pool.query('SELECT * FROM departamentos_academicos');
            
            // Verificar si hay resultados
            if (result.recordset && result.recordset.length > 0) {
                return result.recordset;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error al obtener departamentos:', error);
            return null;
        } finally {
            // No es necesario cerrar la conexión explícitamente ya que pool.query lo hace automáticamente
            // await pool.close();
        }
    }
}

module.exports = new DepartamentosModel();
