var db = require('../conections/database');
const validator = require('../controllers/validator');
const carrerasModel = require('./carreras-model');
const correo = require('../controllers/correo');
const personasModel = require('./personas-model');


class EstudiantesModel{
    constructor(){

    }
    /** forma de enviar peticion, ver en postman */
    /**para crear un estudiante solo se necesita el numero de identidad y la carrera, entonces recibiremos esos dos datos */
    async createEstudiantes(req,res){
        
        try {
                        
            var carrerasValidas = await carrerasModel.getCarrerasIdsArray();
            
            //console.log('carrerasValidas::',carrerasValidas);
            var estudiantesNoValidos = [];
            var estudiantesAgregados = [];

            /** arreglo de estudiantes, donde cada estudiante tiene el formato: [identidad, carrera] */
            var estudiantes = req.body.estudiantes;
            

            /**validando los parametros recibidos de cada estudiante */
            for(let estudiante of estudiantes){
                let identidad = estudiante[0];
                let carreraEstudiante = estudiante[1];

                let infoEstudiante; //para enviar correo
                let msjToSend;

                /**validando si existe el campo identidad y si es valida */
                if (identidad && validator.identidad(identidad)){
                    
                    /**validando que existe la carrera */
                    if(carrerasValidas.includes(carreraEstudiante) && validator.carrera(carreraEstudiante)){
                        
                        if(await personasModel.existePersona(identidad)){//si la persona existe, ya que no se puede agregar un estudiante que no este en el sistema previamente.
                            
                            await db.connect();
                            await db.query(
                                `[dbo].[agregar_estudiante] @numIdentidad ='${identidad}', @id_carrera = ${carreraEstudiante};`
                            );
                            
                            /**Solicitando informacion para enviarle un correo de notificacion al estudiante que se agrego. */
                            infoEstudiante = await db.query(
                                `select p.primer_nombre+' '+p.primer_apellido nombre, p.correo correoPersonal, e.correo_institucional correoInstitucional,
                                e.num_cuenta numeroCuenta
                                from  estudiantes e inner join personas p on p.numero_identidad = e.id_persona
                                where p.numero_identidad = '${identidad}';`
                            );
                            await db.close();

                            infoEstudiante = infoEstudiante[0];
                            msjToSend = `Hola muy Buenas estimado ${infoEstudiante.nombre} nos complace enviarle su correo Institucional ${infoEstudiante.correoInstitucional}, junto su numero de cuenta ${infoEstudiante.numeroCuenta}.
                            Favor obtener su contraseña en la pagina de inicio de sesion, medidante el boton olvide mi crontraseña para tener acceso al portal web.`;
                            
                            correo.enviarCorreo(infoEstudiante.correoPersonal,'CREDENCIALES REGISTRO UNAH',msjToSend);
                            estudiantesAgregados.push(estudiante);

                        }else{
                            console.log('La persona no existe para crear el estudiante con identidad: ',identidad);
                            estudiantesNoValidos.push(estudiante);
                        }
                        
                    
                    }else{
                        console.log('carrera No valida para:',identidad,'carreraNoValida:',carreraEstudiante);
                        estudiantesNoValidos.push(estudiante);
                    }
                }else{
                    console.log('Identidad No Validad para:', identidad);
                    estudiantesNoValidos.push(estudiante);
                }
            }


            res.json({
                 "msj":"se procesaron los datos Ingresados", "result":estudiantesAgregados, "succes":true, "error":estudiantesNoValidos
            });
            

            } catch (error) {
                console.log(error);
                res.json({
                    "msj":"No se agregaron todos los estudiantes", "result":estudiantesAgregados, "succes":false, "error":estudiantesNoValidos
               });
            }
    }

    
    async getEstudiantesFromCSV(){

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