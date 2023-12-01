const Contacto = require('../models/Modelos_para_chats/Contacto');

const agregarContacto = async (estudianteId, contactoId) => {
    try {
        return await Contacto.create({ estudiante_id: estudianteId, contacto_id: contactoId });
    } catch (error) {
        throw error;
    }
};

const obtenerContactos = async (estudianteId) => {
    try {
        return await Contacto.findAll({ where: { estudiante_id: estudianteId } });
    } catch (error) {
        throw error;
    }
};

module.exports = { agregarContacto, obtenerContactos };