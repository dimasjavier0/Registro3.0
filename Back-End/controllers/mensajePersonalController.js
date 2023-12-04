const db = require('../conections/database');

async function enviarMensajePersonal(senderId, receiverId, texto) {
    await db.connect();
    const result = await db.query(`INSERT INTO Messages (senderId, receiverId, text) VALUES ('${senderId}', '${receiverId}', '${texto}')`);
    await db.close();
    return result;
}

async function obtenerMensajesPersonales(usuarioId) {
    await db.connect();
    const result = await db.query(`SELECT * FROM Messages WHERE senderId = '${usuarioId}' OR receiverId = '${usuarioId}'`);
    await db.close();
    return result;
}

module.exports = { enviarMensajePersonal, obtenerMensajesPersonales };
