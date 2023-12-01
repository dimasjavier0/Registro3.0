const Grupo = require('../models/Modelos_para_chats/Grupo');

const crearGrupo = async (nombreGrupo, creadorId) => {
    try {
        return await Grupo.create({ nombre_grupo: nombreGrupo, creador_id: creadorId });
    } catch (error) {
        throw error;
    }
};

module.exports = { crearGrupo };