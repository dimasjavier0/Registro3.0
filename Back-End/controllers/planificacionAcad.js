const db = require('../conections/database');
const moment = require('moment');

class PlanificacionAcademica{
    constructor(){}

    //Metodo para activar la planificacion academica segun el tipo de periodo semestral o trimestral
    async activarPlanificacion(fechaInicio, fechaFin, tipo_periodo){
        try{
            fechaInicio = moment(fechaInicio, 'DD-MM-YYYY').format('YYYY-MM-DD');
            fechaFin = moment(fechaFin, 'DD-MM-YYYY').format('YYYY-MM-DD');

            if(fechaInicio > fechaFin){
                return {estado: false, mensaje: 'La fecha de inicio es posterior a la fecha final'};
            }

            await db.connect();

            let verificarProceso = await db.query(`SELECT pap.id_periodo
            FROM Procesos_academicos pa
            INNER JOIN Procesos_academicos_periodo pap ON  pa.id_PAC = pap.id_proceso_academico
            INNER JOIN periodos_academicos pac ON pap.id_periodo = pac.id_periodo
            WHERE (GETDATE() BETWEEN pa.fecha_inicio AND pa.fecha_fin) AND estado = 1 AND pa.tipo_proceso = 3 AND pac.tipo_periodo = '${tipo_periodo}'
            `);

            if(verificarProceso.length == 0){
                let resultado = await db.query(`EXEC dbo.ActivarPlanificacion @fechaInicio = '${fechaInicio}',
                @fechaFin  = '${fechaFin}', @tipoPeriodo = '${tipo_periodo}'`);

                if(resultado[0].ErrorNumber != null){
                    return {estado: false,
                        mensaje: 'Error al activar el proceso de planificación académica'};
                }else{
                    return {estado: true,
                        mensaje: 'Proceso de planificación académica activado correctamente'};
                }
            }

            await db.close();
            return {estado: false, mensaje: 'El proceso de planificación académica ya esta activo'};
        }catch(error){
            throw error;
        }
    }
}

module.exports = new PlanificacionAcademica();