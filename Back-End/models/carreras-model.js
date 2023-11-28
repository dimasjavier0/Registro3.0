var db = require('../conections/database');

class CarrerasModel{
    constructor(){
        this.carrerasResult;
    }
    async getAllCarreras(){
        try {
            
            
            await db.connect();

            this.carrerasResult = await db.query(`select * from carreras;`);
            
            //console.log('MOSTRANDO:',this.carrerasResult);

            await db.close();

            if (this.carrerasResult.length>0){
                //console.log(`+++ ${this.carrerasResult} +++`);
                return this.carrerasResult;
                
            }else{
                console.log(`No se recibio carreas de la base `);
                return null;
            }
        } catch (error) {
            
        }
    }

    async getTreeRequisitosCarreras(){
        try {

            listaCarreras = db.query(`select * from carreras;`);
            console.log(listaCarreras);

        } catch (error) {
            console.log(`Error al obtener requisitos carrera`);   
        }
    }
}

module.exports = new CarrerasModel();