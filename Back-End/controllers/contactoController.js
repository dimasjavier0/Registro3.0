const db = require('../conections/database');

async function agregarContacto(estudianteId, contactoId) {
    await db.connect();
    const result = await db.query(`INSERT INTO Contactos (estudiante_id, contacto_id) VALUES ('${estudianteId}', '${contactoId}')`);
    await db.close();
    return result;
}

async function obtenerContactos(estudianteId) {
    await db.connect();
    const result = await db.query(`SELECT * FROM Contactos WHERE estudiante_id = '${estudianteId}'`);
    await db.close();
    return result;
}

module.exports = { agregarContacto, obtenerContactos };
