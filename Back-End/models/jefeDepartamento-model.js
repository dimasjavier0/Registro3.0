const db = require('../conections/database');



class JefeDep {
    constructor() { }

    //Metodo para verificar si el proceso de planificacion academica esta activo para el departamento
    async verificarProceso(num_empleado) {
        try {
            await db.connect();
            //verificar si el proceso esta activo
            let procesoActivo = await db.query(`SELECT pap.id_periodo, pac.descripcion
            FROM Procesos_academicos pa
            INNER JOIN Procesos_academicos_periodo pap ON  pap.id_proceso = pa.id_proceso
            INNER JOIN periodos_academicos pac ON pap.id_periodo = pac.id_periodo
            WHERE estado = 1 AND pa.tipo_proceso = 4 AND (GETDATE() BETWEEN pac.fecha_inicio AND pac.fecha_fin)`);

            if (procesoActivo.length > 0) {
                let tipoDep = await db.query(`SELECT da.tipo_dep
                FROM departamentos_academicos da
                INNER JOIN jefes_departamentos jf ON da.id_dep_academico = jf.id_departamentoAcademico
                WHERE jf.id_docente = ${num_empleado}`);

                const objetosFiltradosSemestral = procesoActivo.filter(objeto => objeto.descripcion.includes('Semestre') && tipoDep[0].tipo_dep == 'SM   ');

                if (objetosFiltradosSemestral.length > 0) {
                    return {estado: true, mensaje: objetosFiltradosSemestral[0].id_periodo};
                }else{
                    const objetosFiltradosTimestral = procesoActivo.filter(objeto => objeto.descripcion.includes('Periodo') && tipoDep[0].tipo_dep == 'TM   ');

                    if(objetosFiltradosTimestral.length > 0){
                        return {estado: true, mensaje: objetosFiltradosTimestral[0].id_periodo};
                    }
                }
            }

            return {
                estado: false,
                mensaje: 'El proceso de planificación académica no esta activo'
            };
        } catch (error) {
            throw error;
        }finally{await db.close();}
    }

    //Metodo para recuperar las asignaturas del departamento
    async asignaturasDep(num_empleado) {
        try {
            await db.connect();

            let asignaturas = await db.query(`SELECT asig.id_asignatura ,asig.nombre_asig
            FROM asignaturas asig
            INNER JOIN jefes_departamentos jd ON asig.id_dep_academico = jd.id_departamentoAcademico
            WHERE id_docente = ${num_empleado}`);

            if (asignaturas.length > 0) {
                return {
                    estado: true, resultado: asignaturas};
            }
            await db.close();

            return {
                estado: false,
                resultado: 'No existen asignaturas para este departamento académico'
            };

        } catch (error) {
            throw error;
        }
    }

    //Metodo para recuperar los docentes del departamento
    async docentesDep(num_empleado) {
        try {
            await db.connect();

            let docentes = await db.query(`SELECT d.num_empleado, p.primer_nombre+' '+p.segundo_nombre+' '+p.segundo_apellido AS nombre
            FROM docentes d
            INNER JOIN personas p ON d.id_persona = p.numero_identidad
            INNER JOIN jefes_departamentos jd ON jd.id_departamentoAcademico = d.id_dep_academico
            WHERE jd.id_docente = ${num_empleado}`);

            if (docentes.length > 0) {
                return {
                    estado: true, resultado: docentes};
            }
            await db.close();

            return {
                estado: false, resultado: 'No existen docentes para este departamento académico'};
        } catch (error) {
            throw error;
        }
    }

    //Metodo para recuperar las aulas y sus edificios en el centro al que pertenece el jefe
    async aulasEdificios(num_empleado) {
        try {
            await db.connect();

            let aulas = await db.query(`SELECT id_aula, numero_aula+'/'+nombre AS aula_Edificio
            FROM aulas
            INNER JOIN edificios ON aulas.id_edificio = edificios.id_edificio
            INNER JOIN centros_regionales ON centros_regionales.id_centro = edificios.id_centro
            INNER JOIN docentes d ON d.id_centro = centros_regionales.id_centro
            WHERE d.num_empleado = ${num_empleado}`);

            if (aulas.length > 0) {
                return {
                    estado: true, resultado: aulas};
            }
            await db.close();
            return {
                estado: false, resultado: 'Error al obtener las aulas y edificios'};
        } catch (error) {
            throw error;
        }
    }

    async seccionDias() {
        try {
            await db.connect();

            let dias = await db.query(`SELECT * FROM Dias`);

            await db.close();
            return dias;
        } catch (error) {
            throw error;
        }
    }

    //Para validar si se cumplen ciertos requisitos
    async validarSeccion(num_empleado, seccion) {
        try {
            //validar si el docente pertenece al departamento
            const docente = await this.docentesDep(num_empleado);
            
            if(docente.estado){
                const docentesArray = Object.values(docente.resultado);
                const docenteEncontrado = docentesArray.find(docente => docente.num_empleado == seccion.idDocente);
                
                if (docenteEncontrado == undefined) {
                    return { estado: false, mensaje: `El docente con numero de empleado ${seccion.idDocente} no pertenece al departamento` };
                }
            }
            
            //validar si la asignatura pertenece al departamento
            let asignatura = await this.asignaturasDep(num_empleado);

            if(asignatura.estado){
                const asignaturaArray = Object.values(asignatura.resultado);
                const asigEncontrada = asignaturaArray.find(asignatura => asignatura.id_asignatura == seccion.idAsignatura);
                
                if (asigEncontrada == undefined) {
                    return { estado: false, mensaje: 'La asignatura no pertenece al departamento' };
                }
            }

            //validar si el aula pertenece al centro regional
            let aulas = await this.aulasEdificios(num_empleado)

            if(aulas.estado){
                const aulaArray = Object.values(aulas.resultado);
                const aulaEncontrada = aulaArray.find(aula => aula.id_aula == seccion.idAula);

                if (aulaEncontrada == undefined) {
                    return { estado: false, mensaje: 'El aula no pertnece al centro regional' };
                }
            }

            //Validar que la horaInicio y fin tenga el formato deseado
            if (!validarFormatoHora(seccion.horaInicio)) {
                return { estado: false, mensaje: 'La hora no tiene el formato deseado' };
            }
            if (!validarFormatoHora(seccion.horaFin)) {
                return { estado: false, mensaje: 'La hora no tiene el formato deseado' };
            }

            //validar que la hora de inicion sea mayor que la hora final
            if(seccion.horaInicio > seccion.horaFin){
                return {estado: false, mensaje: 'La fecha de inicio es posterior a la fecha final'};
            }

            return { estado: true };
        } catch (error) {
            throw error;
        }
    }

    //Metodo para crear una seccion 
    async crearSeccion(num_empleado, seccion) {
        try {
            //Encontrar el periodo actual
            const resultado = await this.verificarProceso(num_empleado);
            
            if (resultado.estado) {
                await db.connect();

                let mismoDocente = await db.query(`SELECT id_seccion
                FROM secciones s
                INNER JOIN Asignaturas_PAC ap ON ap.id_asignatura_pac = s.id_asignatura
                INNER JOIN periodos_academicos pa ON ap.id_periodo = pa.id_periodo
                WHERE pa.id_periodo = ${resultado.mensaje} AND s.id_docente = ${seccion.idDocente} 
                AND (hora_inicio BETWEEN ${seccion.horaInicio} AND (${seccion.horaFin})-10)`);

                if(mismoDocente.length > 0){
                    for (const objeto of mismoDocente) {
                        let dias = await db.query(`SELECT d.id_dia, d.descripcion
                        FROM Dias_asignatura da INNER JOIN Dias d ON da.id_dia = d.id_dia
                        WHERE id_seccion = ${objeto.id_seccion}`);

                        const coincidencias = dias.filter(objeto => {
                            return seccion.dias.includes(objeto.id_dia);
                        });
                        
                        if(coincidencias.length > 0){
                            return {estado: false, mensaje: 'Problema con el docente'};
                        }
                      }
                } 

                let mismaAula = await db.query(`SELECT id_seccion
                FROM secciones s
                INNER JOIN Asignaturas_PAC ap ON ap.id_asignatura_pac = s.id_asignatura
                INNER JOIN periodos_academicos pa ON ap.id_periodo = pa.id_periodo
                WHERE pa.id_periodo = ${resultado.mensaje} AND s.id_aula = ${seccion.idAula} 
                AND (hora_inicio BETWEEN ${seccion.horaInicio} AND (${seccion.horaFin})-10)`);

                if(mismaAula.length > 0){
                    for (const objeto of mismaAula) {
                        let dias = await db.query(`SELECT d.id_dia, d.descripcion
                        FROM Dias_asignatura da INNER JOIN Dias d ON da.id_dia = d.id_dia
                        WHERE id_seccion = ${objeto.id_seccion}`);

                        const coincidencias = dias.filter(objeto => {
                            return seccion.dias.includes(objeto.id_dia);
                        });
                        
                        if(coincidencias.length > 0){
                            return {estado: false, mensaje: 'Problema con el aula'};
                        }
                      }
                }

                const diasAsignatura = seccion.dias.map(valor => `${valor}`).join(',');

                console.log(diasAsignatura, typeof diasAsignatura)

                let seccionCreada = await db.query(`EXEC dbo.crear_seccion @idPeriodo = ${resultado.mensaje}, @idAsignatura = ${seccion.idAsignatura},
                @idDocente = ${seccion.idDocente}, @idAula = ${seccion.idAula}, @horaInicio = ${seccion.horaInicio},
                @horaFin = ${seccion.horaFin},
                @cupos = ${seccion.cuposDisponibles},
                @dias = '${diasAsignatura}'`); 

                await db.close(); 

                if(seccionCreada[0].ErrorNumber != null){
                    return {estado: false, mensaje: 'Error al agregar la sección'};
                }else{
                    return {estado: true, mensaje: 'Sección agregada'};
                }
            }

            return {estado: false};
        } catch (error) {
            throw error;
        }
    }

    //metodo para aumentar los cupos de una seccion
    async aumentarCupos(idSeccion, nuevosCupos){
        try {
            await db.connect();

            let cuposActuales = await db.query(`SELECT cupos_maximos
            FROM secciones s
            INNER JOIN Asignaturas_PAC asigP ON s.id_asignatura = asigP.id_asignatura_pac
            WHERE id_seccion = ${idSeccion}`);

            if(cuposActuales.length > 0){
                if(nuevosCupos > cuposActuales[0].cupos_maximos){
                    await db.query(`UPDATE secciones
                    SET cupos_maximos = ${nuevosCupos}
                    WHERE id_seccion = ${idSeccion}`);

                    return {estado: true};
                }else{
                    return {estado: false, mensaje: 'Tiene que aumentar los cupos de la sección'};
                }
            }

            return {estado: false, mensaje: 'La sección no existe o no pertenece al departamento'};;
        } catch (error) {
            throw error;
        } finally {
            await db.close();
        }      
    }

    //Metodo para cancelar una seccion
    async cancelarSeccion(num_empleado, idSeccion, justificacion){
        try {
            await db.connect();
            //Verificar que la seccion pertenezca al departamento academico
            let resultado = await db.query(`SELECT jf.id_jefe, asig.id_asignatura
            FROM secciones s
            INNER JOIN Asignaturas_PAC asigP ON s.id_asignatura = asigP.id_asignatura_pac
            INNER JOIN asignaturas asig ON asigP.id_asignatura_carrera = asig.id_asignatura
            INNER JOIN jefes_departamentos jf ON asig.id_dep_academico = jf.id_departamentoAcademico
            WHERE jf.id_docente = ${num_empleado} AND id_seccion = ${idSeccion}`);

            if(resultado.length > 0){
                //Borrar la seccion en la tabla secciones y las tablas relacionadas
                await db.query(`DELETE FROM Dias_asignatura
                WHERE id_seccion = ${idSeccion}`);

                await db.query(`DELETE FROM matricula_estudiantes
                WHERE id_seccion = ${idSeccion}`);

                await db.query(`DELETE FROM secciones
                WHERE id_seccion = ${idSeccion}`);

                //hacer el insert en la tabla secciones_canceladas
                await db.query(`INSERT INTO secciones_canceladas(id_asignatura, id_jefeDep, justificacion)
                VALUES(${resultado[0].id_asignatura},${resultado[0].id_jefe}, '${justificacion}')`);

                return true;
            }

            return false;
        } catch (error) {
            throw error;
        }finally{ await db.close();}
    }

    //metodo para ver las secciones del periodo
    async seccionesPAC(num_empleado){
        try {
            const verificarPeriodo = await this.verificarProceso(num_empleado);

            if(verificarPeriodo.estado){
                const periodoActual = verificarPeriodo.mensaje;

                const secciones = await db.query(`SELECT id_seccion, cod_seccion, asig.nombre_asig, s.id_docente, hora_inicio, hora_fin
                FROM secciones s
                INNER JOIN Asignaturas_PAC asigP ON s.id_asignatura = asigP.id_asignatura_pac
                INNER JOIN asignaturas asig ON asigP.id_asignatura_carrera = asig.id_asignatura
                INNER JOIN jefes_departamentos jf ON asig.id_dep_academico = jf.id_departamentoAcademico
                WHERE jf.id_docente = ${num_empleado} AND asigP.id_periodo = ${periodoActual}`);

                
                if(secciones.length > 0){
                    return {estado: true, mensaje: secciones};
                }else{
                    return {estado: false, mensaje: 'No existen secciones'};
                }
            }

            return {estado: false, mensaje: 'No existen secciones'};
        } catch (error) {
            throw  error;
        }finally{await db.close();}
    }

    //Metodo para ver las lista de espera de una seccion
    async verListaEspera(num_empleado, idSeccion){
        try {
            let secciones = await this.seccionesPAC(num_empleado);
            
            if(secciones.estado){
                const seccionesArray = Object.values(secciones.mensaje);
                const seccionEncontrada = seccionesArray.find(seccion => seccion.id_seccion == idSeccion);
                
                if (seccionEncontrada == undefined) {
                    return { estado: false, mensaje: `La sección no pertenece al departamento`};
                }else{
                    await db.connect();

                    let listaEspera = await db.query(`SELECT num_cuenta, primer_nombre+' '+segundo_nombre+' '+primer_apellido AS nombre
                    FROM matriculas_listaEspera list 
                    INNER JOIN estudiantes st ON list.id_estudiante = st.num_cuenta
                    INNER JOIN personas p ON st.id_persona = p.numero_identidad
                    WHERE id_seccion = ${idSeccion}`);

                    if(listaEspera.length > 0){
                        return { estado: true, mensaje: listaEspera};
                    }else{
                        return {estado: false, mensaje: 'No hay estudiantes en lista de espera'};
                    }
                }
            }

            return {estado: false, mensaje: 'No hay secciones'};
        } catch (error) {
            throw error;
        }finally{await db.close();}
    }

}

function validarFormatoHora(hora) {
    const regex = /^(0[0-9]|1[0-9]|2[0-3])[0-5][0-9]$/;

    return regex.test(hora);
}

module.exports = new JefeDep();