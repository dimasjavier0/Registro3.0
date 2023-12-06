const db = require('../conections/database');
const correo = require('../controllers/correo');


class ControllerNotes{
    constructor(){}

    //Metodo para que el admin active el proceso de ingreso de notas
    async activarProcesoEvaluacion(){
        try {
            await db.connect();

            let verificarProceso = await db.query(`SELECT pap.id_periodo
            FROM Procesos_academicos pa
            INNER JOIN Procesos_academicos_periodo pap ON  pa.id_PAC = pap.id_proceso_academico
            WHERE (GETDATE() BETWEEN pa.fecha_inicio AND pa.fecha_fin) AND estado = 1 AND pa.tipo_proceso = 2;`);

            if(verificarProceso.length == 0){
                let resultado = await db.query(`EXEC dbo.ActivarRevision`);

                if(resultado[0].ErrorNumber != null){
                    return {estado: false,
                        mensaje: resultado[0].ErrorMessage};
                }else{
                    return {estado: true,
                        mensaje: 'Proceso de ingreso de notas activado correctamente'};
                }
            }

            await db.close();
            return {estado: false,
                mensaje: 'El proceso de ingreso de notas ya esta activo'};
        } catch (error) {
            throw error;
        }
    }

    //Metodo para verificar si el proceso de evaluacion esta activo
    async verificarProcesoEvaluacion(idDocente){
        try {
            await db.connect();

            const resultado = await db.query(`SELECT pa.id_periodo
            FROM periodos_academicos pa
            INNER JOIN Procesos_academicos_periodo pap ON pa.id_periodo = pap.id_periodo
            INNER JOIN Procesos_academicos pro ON pap.id_proceso_academico = pro.id_PAC
            WHERE (GETDATE() BETWEEN pa.fecha_inicio AND pa.fecha_fin) AND pro.tipo_proceso = 2 AND estado = 1
                AND (GETDATE() BETWEEN pro.fecha_inicio AND pro.fecha_fin)`);
            
            await db.close();

            if(resultado.length > 0){
                let resultadoMod = await this.seccionesPeriodo(idDocente, resultado[0].id_periodo);
                if(resultado.length >= 1){
                    let result = await this.seccionesPeriodo(idDocente, resultado[1].id_periodo);

                    if(result.length > 0){
                        resultadoMod.push(...result);
                    }
                }
                return {
                    estado: true,
                    periodos: resultadoMod};
            }

            return {estado: false};
        } catch (error) {
            throw error;
        }
    }

    async seccionesPeriodo(id_docente, id_periodo){
        try{
            await db.connect();

            let secciones = await db.query(`SELECT s.id_seccion, s.hora_inicio, asig.id_asignatura, asig.nombre_asig
            FROM secciones s INNER JOIN asignaturas asig ON s.id_asignatura = asig.id_asignatura
            INNER JOIN Asignaturas_PAC ap ON ap.id_asignatura_carrera = asig.id_asignatura
            INNER JOIN periodos_academicos pa ON ap.id_periodo = pa.id_periodo
            INNER JOIN docentes d ON d.num_empleado = s.id_docente
            WHERE s.id_docente = ${id_docente} AND pa.id_periodo = ${id_periodo}`);

            return secciones;
        }catch(error){
            throw error;
        }finally{
            await db.close()
        }
    }

    //Metodo para validar las notas y observaciones de un estudiante
    async validarNotas(idseccion, estudianteNotas){
        try {
            await db.connect();
            const id_matricula = await db.query(`SELECT m.id_matricula
                                    FROM estudiantes e 
                                    JOIN matricula_estudiantes m ON e.num_cuenta = m.id_estudiante
                                    JOIN secciones s ON s.id_seccion = m.id_seccion
                                    WHERE m.id_seccion = ${idseccion} and e.num_cuenta = ${estudianteNotas.numero_cuenta}`);
                                    
            await db.close();

            if (id_matricula.length == 0) {
                return {
                    'estado': false,
                    'numero_cuenta': estudianteNotas.numero_cuenta,
                    'nota': estudianteNotas.nota,
                    'observacion': estudianteNotas.observacion,
                    'mensaje': `El estudiante no esta matriculado en la sección`
                };
            } else if (estudianteNotas.nota > 100 || estudianteNotas.nota < 0) {
                return {
                    'estado': false,
                    'numero_cuenta': estudianteNotas.numero_cuenta,
                    'nota': estudianteNotas.nota,
                    'observacion': estudianteNotas.observacion,
                    'mensaje': `Valor de la nota inválido`
                };
            } else if (((estudianteNotas.nota < 65 && estudianteNotas.nota> 0) && 
                        (estudianteNotas.observacion == 1 || estudianteNotas.observacion == 4)) ) {
                return {
                    'estado': false,
                    'numero_cuenta': estudianteNotas.numero_cuenta,
                    'nota': estudianteNotas.nota,
                    'observacion': estudianteNotas.observacion,
                    'mensaje': `La observacion no concuerda con el valor de la nota`
                };
            }else{
                return {
                    'estado': true,
                    'numero_cuenta': estudianteNotas.numero_cuenta,
                    'nota': estudianteNotas.nota,
                    'observacion': estudianteNotas.estado
                };    
            }
            
        } catch (error) {
            throw error.message;
        }
    }

    async getObservaciones(){
        try{
            await db.connect();

            let observacionesNotas = await db.query(`SELECT * FROM estado_calificacion`);

            await db.close();

            if(observacionesNotas.length > 0){
                return observacionesNotas;
            }

            return null;
        }catch(err){
            throw err;
        }
    }

    async enviarCorreos(id_seccion){
        try {
            await db.connect();

            let resultado = await db.query(`SELECT e.num_cuenta, p.correo, m.nota
                                            FROM personas p
                                            JOIN estudiantes e ON p.numero_identidad = e.id_persona
                                            JOIN matricula_estudiantes m ON e.num_cuenta = m.id_estudiante
                                            JOIN secciones s ON s.id_seccion = m.id_seccion
                                            JOIN asignaturas a ON a.id_asignatura = s.id_asignatura
                                            WHERE m.id_seccion = ${id_seccion}`);


            const asignatura = await db.query(`SELECT asg.nombre_asig
                                            FROM secciones s
                                            INNER JOIN asignaturas asg ON s.id_asignatura = asg.id_asignatura
                                            WHERE s.id_seccion = ${id_seccion}`);
                                                      
            if( resultado.every(elemento => elemento.nota !== null && elemento.nota !== undefined) ){
                await db.query(`UPDATE secciones
                    SET ingreso_notas = 1
                    WHERE id_seccion = ${id_seccion}`);

                let mensaje = `Ya puede revisar su nota en la clase ${asignatura[0].nombre_asig}.
Recuerde que antes de ver sus notas tiene que realizar la evaluación docente.`

                for(let i = 0; i < resultado.length; i++){
                    await correo.enviarCorreo(resultado[i].correo, 'Revision de calificaciones', mensaje);
                 }
                
                return {
                    'estado': true,
                    'mensaje': 'Notas ingresadas correctamente'};
            }

            await db.close();

            return {
                'estado': false,
                'mensaje': 'Hay estudiantes que no tienen nota'};
            
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ControllerNotes();