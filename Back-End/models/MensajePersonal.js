const Sequelize = require('sequelize');
var db = require('../conections/database');

const MensajePersonal = db.define('MensajesPersonales', {
    id_mensaje: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    remitente_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: 'estudiantes', // Nombre de la tabla de estudiantes
            key: 'num_cuenta'    // Clave primaria de la tabla de estudiantes
        }
    },
    destinatario_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
            model: 'estudiantes', // Nombre de la tabla de estudiantes
            key: 'num_cuenta'    // Clave primaria de la tabla de estudiantes
        }
    },
    texto: {
        type: Sequelize.STRING(1000), // Limita la longitud del mensaje si es necesario
        allowNull: false
    },
    fecha_hora_envio: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
});

module.exports = MensajePersonal;