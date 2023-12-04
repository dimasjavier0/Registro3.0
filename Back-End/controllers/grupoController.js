const db = require('../conections/database');

async function crearGrupo(nombreGrupo, creadorId) {
    await db.connect();
    const result = await db.query(`INSERT INTO Grupos (nombre_grupo, creador_id) VALUES ('${nombreGrupo}', '${creadorId}')`);
    await db.close();
    return result;
}

async function obtenerGrupos() {
    await db.connect();
    const result = await db.query(`SELECT * FROM Grupos`);
    await db.close();
    return result;
}

module.exports = { crearGrupo, obtenerGrupos };
