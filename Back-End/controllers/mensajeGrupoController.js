const MensajeGrupo = require('../models/Modelos_para_chats/MensajeGrupo');

const enviarMensajeGrupo = async (idGrupo, remitenteId, texto) => {
    try {
        return await MensajeGrupo.create({
            id_grupo: idGrupo,
            remitente_id: remitenteId,
            texto: texto
        });
    } catch (error) {
        throw error;
    }
};

module.exports = { enviarMensajeGrupo };