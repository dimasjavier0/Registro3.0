var db = require('../conections/database');

class EstudiantesModel{
    constructor(){

    }
    async createEstudiantes(req,res){
        console.log("RESPUESTA ESTUDIANETS DEL CSV::::",req.body);
        res.json({ "msj":"parametros recibidos", "result":req.body});
    }

    

}

module.exports = new EstudiantesModel();