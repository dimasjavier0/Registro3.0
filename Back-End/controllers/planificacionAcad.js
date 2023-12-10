const db = require('../conections/database');
const moment = require('moment');

class PlanificacionAcademica{
    constructor(){}

    //Metodo para activar la planificacion academica segun el tipo de periodo semestral o trimestral
    async activarPlanificacion(fechaInicio, fechaFin, idPeriodo){
        try{
            const fechaInicioMoment = moment(fechaInicio, ['DD-MM-YYYY', 'YYYY-MM-DD'], true);
            if (fechaInicioMoment.isValid()) {
                fechaInicio = fechaInicioMoment.format('YYYY-MM-DD');
            }

            // Intentar analizar y formatear fechaFin
            const fechaFinMoment = moment(fechaFin, ['DD-MM-YYYY', 'YYYY-MM-DD'], true);
            if (fechaFinMoment.isValid()) {
                fechaFin = fechaFinMoment.format('YYYY-MM-DD');
            }
            
            if(fechaInicio > fechaFin){
                return {estado: false, mensaje: 'La fecha de inicio es posterior a la fecha final'};
            }

            await db.connect();

            let verificarPeriodo = await db.query(`SELECT id_periodo
            FROM periodos_academicos pa
            WHERE (GETDATE() BETWEEN pa.fecha_inicio AND pa.fecha_fin) AND id_periodo = ${idPeriodo}`);

            if(verificarPeriodo.length > 0){
                let verificarProceso = await db.query(`SELECT pap.id_periodo
                FROM Procesos_academicos pa
                INNER JOIN Procesos_academicos_periodo pap ON  pap.id_proceso = pa.id_proceso
                WHERE estado = 1 AND pa.tipo_proceso = 4 AND id_periodo = ${idPeriodo}`);

                if(verificarProceso.length == 0){
                    let resultado = await db.query(`EXEC dbo.ActivarPlanificacion @fechaInicio = '${fechaInicio}',
                    @fechaFin  = '${fechaFin}', @idPeriodo = '${idPeriodo}'`);
    
                    if(resultado[0].ErrorNumber != null){
                        return {estado: false, mensaje: 'Error al activar el proceso de planificación académica'};
                    }else{
                        return {estado: true, mensaje: 'Proceso de planificación académica activado correctamente'};
                    }
                }
                return {estado: false, mensaje: 'El proceso de planificación académica ya esta activo'};
            }
            
            return {estado: false, mensaje: 'El periodo académico no esta activo'};
        }catch(error){
            throw error;
        }finally{
            await db.close();
        }
    }
}

module.exports = new PlanificacionAcademica();