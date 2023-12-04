const db = require('../conections/database');

async function enviarSolicitudContacto(solicitanteId, solicitadoId) {
    await db.connect();
    const result = await db.query(`INSERT INTO SolicitudesContacto (solicitante_id, solicitado_id, estado) VALUES ('${solicitanteId}', '${solicitadoId}', 'Pendiente')`);
    await db.close();
    return result;
}

async function obtenerSolicitudesContacto(estudianteId) {
    await db.connect();
    const result = await db.query(`SELECT * FROM SolicitudesContacto WHERE solicitado_id = '${estudianteId}'`);
    await db.close();
    return result;
}

module.exports = { enviarSolicitudContacto, obtenerSolicitudesContacto };

