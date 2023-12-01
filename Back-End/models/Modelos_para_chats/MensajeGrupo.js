const Sequelize = require('sequelize');
const db = require('../conections/database');

const MensajeGrupo = db.define('MensajesGrupo', {
    id_mensaje: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_grupo: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    remitente_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    texto: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fecha_hora_envio: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
});

module.exports = MensajeGrupo;