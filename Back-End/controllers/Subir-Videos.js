const mssql = require('mssql');


const config = {
    user: 'Grupo',
    password: '1234',
    server: 'localhost',
    database: 'Registro2',//Registro2
    options: {
      encrypt: false,
      trustServerCertificate: true,
      
    },
  };


const pool = new mssql.ConnectionPool(config);
const poolConnect = pool.connect();

async function subirYGuardarVideo(idSeccion, videoPath) {
  await poolConnect;

  const request = new mssql.Request(pool);

  const query = `
    UPDATE secciones
    SET ruta_video = @videoPath
    WHERE id_seccion = @idSeccion;
  `;

  request.input('videoPath', mssql.VarChar, videoPath);
  request.input('idSeccion', mssql.Int, idSeccion);

  await request.query(query);
}

module.exports = {
  subirYGuardarVideo,
};
