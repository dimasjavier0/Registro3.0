/*var db = require('../conections/database');

class DepartamentosModel{
    constructor(){

    }
    async getAllCarreras(){
        await db.connect();
        let departamentosJSON = await db.query(`select * from departamentos_academicos`);
        await db.close();
        
        if (departamentosJSON){return departamentosJSON;}
        else{return null;}
    }
}

module.exports = new DepartamentosModel();*/