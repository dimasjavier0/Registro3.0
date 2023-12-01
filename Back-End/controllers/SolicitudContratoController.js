const SolicitudContacto = require('../models/Modelos_para_chats/SolicitudContacto');

const enviarSolicitud = async (solicitanteId, solicitadoId) => {
    try {
        return await SolicitudContacto.create({
            solicitante_id: solicitanteId,
            solicitado_id: solicitadoId,
            estado: 'Pendiente'
        });
    } catch (error) {
        throw error;
    }
};

const obtenerSolicitudes = async (solicitadoId) => {
    try {
        return await SolicitudContacto.findAll({ where: { solicitado_id: solicitadoId } });
    } catch (error) {
        throw error;
    }
};

module.exports = { enviarSolicitud, obtenerSolicitudes };
