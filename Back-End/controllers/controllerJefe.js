const db = require('../conections/database');

class ControllerJefe{
    constructor(){}

    async mostrarEvaluaciones(idDocente, idSeccion){
        try {
            await db.connect();

            let evaluacionesDocente = await db.query(`SELECT  respuesta1, respuesta2, respuesta3, respuesta4, respuesta5, respuesta6
            FROM evaluaciones_docentes ed
            INNER JOIN respuestas res ON ed.id_respuestas = res.id_respuestas
            INNER JOIN secciones s ON ed.id_seccion = s.id_seccion
            INNER JOIN Asignaturas_PAC asigPac ON s.id_asignatura = asigPac.id_asignatura_pac
            INNER JOIN periodos_academicos pac ON asigPac.id_periodo = pac.id_periodo
            WHERE ed.id_docente = ${idDocente} AND ed.id_seccion = ${idSeccion}`);

            await db.close();
            if(evaluacionesDocente.length > 0){
                return {estado: true, mensaje: evaluacionesDocente};
            }

            return {estado: false, mensaje: 'No hay evaluaciones'};
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ControllerJefe();