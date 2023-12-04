const db = require('../conections/database');

async function agregarMiembroGrupo(grupoId, miembroId) {
    await db.connect();
    const result = await db.query(`INSERT INTO MiembrosGrupo (id_grupo, miembro_id) VALUES ('${grupoId}', '${miembroId}')`);
    await db.close();
    return result;
}

async function obtenerMiembrosGrupo(grupoId) {
    await db.connect();
    const result = await db.query(`SELECT * FROM MiembrosGrupo WHERE id_grupo = '${grupoId}'`);
    await db.close();
    return result;
}

module.exports = { agregarMiembroGrupo, obtenerMiembrosGrupo };
