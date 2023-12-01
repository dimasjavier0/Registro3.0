const MensajePersonal = require('../models/Modelos_para_chats/MensajePersonal');

const enviarMensajePersonal = async (remitenteId, destinatarioId, texto) => {
    try {
        return await MensajePersonal.create({
            remitente_id: remitenteId,
            destinatario_id: destinatarioId,
            texto: texto
        });
    } catch (error) {
        throw error;
    }
};

module.exports = { enviarMensajePersonal };