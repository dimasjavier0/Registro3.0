var db = require('../conections/database');

class CarrerasModel{
    constructor(){

    }
    async getAllCarreras(){
        await db.connect();
        let carrerasJSON = await db.query(`select * from carreras`);
        await db.close();
        
        if (carrerasJSON){return carrerasJSON;}
        else{return null;}
    }
}

module.exports = new CarrerasModel();