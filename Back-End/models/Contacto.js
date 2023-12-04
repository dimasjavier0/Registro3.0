const Sequelize = require('sequelize');
const db = require('../conections/database');

const Contacto = db.define('Contactos', {
    id_contacto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estudiante_id: {
        type: Sequelize.STRING,
        allowNull: false
    },
    contacto_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Contacto;