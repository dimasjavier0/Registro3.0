var db = require('../conections/database');

class personasModel{
    constructor(){

    }
    
    /**funcion que valida si una persona existe(return true) o no(false).  */
    async existePersona(idPersona){
        try {
            await db.connect();
            let exist = await db.query(`select count(*) cantidad from personas p where p.numero_identidad = '${idPersona}';`);
            exist = exist[0].cantidad;
            //console.log('EXIST::',exist);
            if(exist && exist>0){
                return true;
            }else{
                return false;
            } 
          } finally {
            await db.close();
            return false;
          }
    }
}

module.exports = new personasModel();