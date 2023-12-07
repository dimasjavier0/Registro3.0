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

    /**retorna un arreglo con los ids de las carreras que estan registradas en la base de datos.
     * en otro caso retorna null.
     */
    async getCarrerasIdsArray(){
        try{
            
            let arrayCarreras = [];
            await db.connect();
            let listaCarrerasId = await db.query(`select id_carrera from carreras;`);
            await db.close();

            //console.log('resultado query::',listaCarrerasId);

            listaCarrerasId.forEach((carreraJson)=>{
                arrayCarreras.push(carreraJson.id_carrera);
            });
            return arrayCarreras;
        }catch (error){
            console.log(error);
            return null;
        }
    }
}

module.exports = new CarrerasModel();