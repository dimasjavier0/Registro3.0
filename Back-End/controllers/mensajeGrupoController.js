const db = require('../conections/database');

async function enviarMensajeGrupo(grupoId, remitenteId, texto) {
    await db.connect();
    const result = await db.query(`INSERT INTO MensajesGrupo (id_grupo, remitente_id, texto) VALUES ('${grupoId}', '${remitenteId}', '${texto}')`);
    await db.close();
    return result;
}

async function obtenerMensajesGrupo(grupoId) {
    await db.connect();
    const result = await db.query(`SELECT * FROM MensajesGrupo WHERE id_grupo = '${grupoId}'`);
    await db.close();
    return result;
}

module.exports = { enviarMensajeGrupo, obtenerMensajesGrupo };
