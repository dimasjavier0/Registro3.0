const Sequelize = require('sequelize');
const db = require('../conections/database');

const MiembroGrupo = db.define('MiembrosGrupo', {
    id_grupo: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    miembro_id: {
        type: Sequelize.STRING,
        primaryKey: true
    }
});

module.exports = MiembroGrupo;