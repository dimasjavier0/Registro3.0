const Sequelize = require('sequelize');
var db = require('../conections/database');

const Grupo = db.define('Grupos', {
    id_grupo: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_grupo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    creador_id: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Grupo;