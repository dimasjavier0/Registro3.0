const Sequelize = require('sequelize');
var db = require('../conections/database');

const SolicitudContacto = db.define('SolicitudesContacto', {
    id_solicitud: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    solicitante_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    solicitado_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    estado: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = SolicitudContacto;