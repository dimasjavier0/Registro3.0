const MiembroGrupo = require('../models/Modelos_para_chats/MiembroGrupo');

const agregarMiembro = async (idGrupo, miembroId) => {
    try {
        return await MiembroGrupo.create({ id_grupo: idGrupo, miembro_id: miembroId });
    } catch (error) {
        throw error;
    }
};

module.exports = { agregarMiembro };