const mssql = require('mssql');

const config = {

    user: 'Grupo',
    password: '1234',
    server: 'localhost', 
    database: 'Registro2',
    options: {
        encrypt: false, // Si estás usando Azure SQL
        trustServerCertificate: true // Solo para desarrollo, no usar en producción
    }
};


const pool = new mssql.ConnectionPool(config);
const poolConnect = pool.connect();

async function subirYGuardarVideo(idSeccion, videoPath) {
  await poolConnect;

  const request = new mssql.Request(pool);

  const query = `
    UPDATE secciones
    SET video = @videoPath
    WHERE idSeccion = @idSeccion;
  `;

  request.input('videoPath', mssql.VarChar, videoPath);
  request.input('idSeccion', mssql.Int, idSeccion);

  await request.query(query);
}

module.exports = {
  subirYGuardarVideo,
};
