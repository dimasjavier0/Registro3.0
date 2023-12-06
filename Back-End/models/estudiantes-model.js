var db = require('../conections/database');


class EstudiantesModel{
    constructor(){

    }
    async createEstudiantes(req,res){
        console.log("RESPUESTA ESTUDIANETS DEL CSV::::",req.body);
        res.json({ "msj":"parametros recibidos", "result":req.body});
    }

    async notasEstudiante(idseccion, id_estudiante, nota, observacion){
        try{
            await db.connect();
            const id_matricula = await db.query(`SELECT m.id_matricula
                                    FROM estudiantes e 
                                    JOIN matricula_estudiantes m ON e.num_cuenta = m.id_estudiante
                                    JOIN secciones s ON s.id_seccion = m.id_seccion
                                    WHERE m.id_seccion = ${idseccion} and e.num_cuenta = ${id_estudiante}`);

            if (nota >= 65 && observacion != 1) {
                observacion = 1; //Aprobo
            }
            if (nota == 0 && observacion != 4) {
                observacion = 4; //No se presento
            }

            await db.query(`UPDATE matricula_estudiantes
                        SET nota =${nota}, id_estado_calificacion = ${observacion}
                        WHERE id_matricula = ${id_matricula[0].id_matricula} `);

            await db.close();
            
            return {
                'numero_cuenta': id_estudiante,
                'nota': nota,
                'observacion': observacion
            };
        } catch (err) {
            throw err.message;
        } 
    }
}

module.exports = new EstudiantesModel();