var db = require('../conections/database');

class UsuariosModel{
    constructor(){

    }
    async getUsuarioById(idUsuario){
        try {
            await db.connect();
            const result = await db.query(`SELECT id_usuario FROM usuarios WHERE correoElectronico = ${idUsuario}`);
            return result.recordset.length > 0 ? result.recordset[0] : null;
          } finally {
            await db.close();
          }
    }
}

module.exports = new CarrerasModel();