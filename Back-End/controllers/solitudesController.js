const db = require("../conections/database");
const estudiantesModel = require("../models/estudiantes-model");

class SolicitudesController{
    constructor(){
        this.existeSolicitud = this.existeSolicitud.bind(this);
        this.insertReposicion = this.insertReposicion.bind(this);
        this.insertCambioCentro = this.insertCambioCentro.bind(this);
        this.insertSolicitudPractica = this.insertSolicitudPractica.bind(this);

    }
    async existeSolicitud(id_solicitante,motivo){
        try{
            await db.connect();
            let existe = await db.query(`select count(*) existe from Solicitudes_hechas_centro where motivo = '${motivo}' and id_solicitante = '${id_solicitante}';`);
            existe = existe[0];
            if (existe.existe && existe.existe>0){
                return true;
            }
            return false;
        }catch (error){
            console.error('Errror al comprobar si ya existe la solicitud ');
            console.log(error);
        }finally{
            await db.close();
        }
    }

    /**funcion que agrega una solicitud de pago de reposicion a un estudiante(numCuenta) */
    async insertReposicion(req,res){
        try {
            //5	Reposición de Examen	201903456	2023-05-01	2023-05-05	1
            await db.connect();
            let cuentaSolicitante = req.params.numeroCuenta;
            var solicitesCreadas = await db.query(`select * from Solicitudes_hechas_centro shc
                inner join Solicitudes s on s.id_solicitud = shc.motivo
                where motivo = '3' and id_solicitante = '${cuentaSolicitante}';`);
                
            if(await !this.existeSolicitud(cuentaSolicitante,3)){
                
                let existe = await estudiantesModel.existeEstudianteByNumeroCuenta(cuentaSolicitante);
                console.log('cuentaSolicitante:',cuentaSolicitante,'existe:',existe)
                if(existe){
                    
                    await db.connect();
                    await db.query(
                        `insert into Solicitudes_hechas_centro(motivo,id_solicitante,fecha_solicitud,fecha_respuesta,id_centro)
                        values(
                            3,'${cuentaSolicitante}',getDate(),getDate(),1
                        );`//por defecto solo los de ciudad universitaria (1).
                    );

                    solicitesCreadas = await db.query(`select * from Solicitudes_hechas_centro shc
                    inner join Solicitudes s on s.id_solicitud = shc.motivo
                    where motivo = '3' and id_solicitante = '${cuentaSolicitante}';`);

                    await db.close();
                    
                    

                    let respuesta ={
                        "msj":"Solicitud de Reposicion hecha",
                        "success":true,
                        "errors":"",
                        "solicitudes": solicitesCreadas
                    };  
                    console.log('respuesta Reposicion:',respuesta);
                    res.json(respuesta);
                }
            }
            else{
                console.log('ocurrio un error al insertar la reposicion.');
                res.json({
                    "msj":"error en solicitud de Reposicion",
                    "success":false,
                    "errors":`no existe el numero de cuenta ${cuentaSolicitante}`,
                    "solicitudes": solicitesCreadas
                });
            }
            
        } catch (error) {
            console.error(error);
            console.log('ocurrio un error al insertar la reposicion.');
            res.json({
                "msj":"error en solicitud de Reposicion",
                "success":false,
                "errors":error.message,
                "solicitudes": solicitesCreadas
            });
        }
        
    }
    async insertCancelacionExepcional(req,res){
        try {
            //3	Reposición de Examen	201903456	2023-05-01	2023-05-05	1
            await db.connect();
            let cuentaSolicitante = req.params.numeroCuenta;
            var solicitesCreadas = await db.query(`select * from Solicitudes_hechas_centro shc
                inner join Solicitudes s on s.id_solicitud = shc.motivo
                where motivo = '2' and id_solicitante = '${cuentaSolicitante}';`);
                
            if(await !this.existeSolicitud(cuentaSolicitante,2)){
                
                let existe = await estudiantesModel.existeEstudianteByNumeroCuenta(cuentaSolicitante);
                console.log('cuentaSolicitante:',cuentaSolicitante,'existe:',existe)
                if(existe){
                    
                    await db.connect();
                    await db.query(
                        `insert into Solicitudes_hechas_centro(motivo,id_solicitante,fecha_solicitud,fecha_respuesta,id_centro)
                        values(
                            2,'${cuentaSolicitante}',getDate(),getDate(),1
                        );`//por defecto solo los de ciudad universitaria (1).
                    );

                    solicitesCreadas = await db.query(`select * from Solicitudes_hechas_centro shc
                    inner join Solicitudes s on s.id_solicitud = shc.motivo
                    where motivo = '2' and id_solicitante = '${cuentaSolicitante}';`);

                    await db.close();
                    
                    

                    let respuesta ={
                        "msj":"Solicitud de Reposicion hecha",
                        "success":true,
                        "errors":"",
                        "solicitudes": solicitesCreadas
                    };  
                    console.log('respuesta Reposicion:',respuesta);
                    res.json(respuesta);
                }
            }
            else{
                console.log('ocurrio un error al insertar la reposicion.');
                res.json({
                    "msj":"error en solicitud de Reposicion",
                    "success":false,
                    "errors":`no existe el numero de cuenta ${cuentaSolicitante}`,
                    "solicitudes": solicitesCreadas
                });
            }
            
        } catch (error) {
            console.error(error);
            console.log('ocurrio un error al insertar la reposicion.');
            res.json({
                "msj":"error en solicitud de Reposicion",
                "success":false,
                "errors":error.message,
                "solicitudes": solicitesCreadas
            });
        }
        
    }
    async insertcambioCarrera(req,res){
        try {
            //3	Reposición de Examen	201903456	2023-05-01	2023-05-05	1
            await db.connect();
            let cuentaSolicitante = req.params.numeroCuenta;
            var solicitesCreadas = await db.query(`select * from Solicitudes_hechas_centro shc
                inner join Solicitudes s on s.id_solicitud = shc.motivo
                where motivo = '1' and id_solicitante = '${cuentaSolicitante}';`);
                
            if(await !this.existeSolicitud(cuentaSolicitante,4)){
                
                let existe = await estudiantesModel.existeEstudianteByNumeroCuenta(cuentaSolicitante);
                console.log('cuentaSolicitante:',cuentaSolicitante,'existe:',existe)
                if(existe){
                    
                    await db.connect();
                    await db.query(
                        `insert into Solicitudes_hechas_centro(motivo,id_solicitante,fecha_solicitud,fecha_respuesta,id_centro)
                        values(
                            1,'${cuentaSolicitante}',getDate(),getDate(),1
                        );`//por defecto solo los de ciudad universitaria (1).
                    );

                    solicitesCreadas = await db.query(`select * from Solicitudes_hechas_centro shc
                    inner join Solicitudes s on s.id_solicitud = shc.motivo
                    where motivo = '1' and id_solicitante = '${cuentaSolicitante}';`);

                    await db.close();
                    
                    

                    let respuesta ={
                        "msj":"Solicitud de Reposicion hecha",
                        "success":true,
                        "errors":"",
                        "solicitudes": solicitesCreadas
                    };  
                    console.log('respuesta Reposicion:',respuesta);
                    res.json(respuesta);
                }
            }
            else{
                console.log('ocurrio un error al insertar la reposicion.');
                res.json({
                    "msj":"error en solicitud de Reposicion",
                    "success":false,
                    "errors":`no existe el numero de cuenta ${cuentaSolicitante}`,
                    "solicitudes": solicitesCreadas
                });
            }
            
        } catch (error) {
            console.error(error);
            console.log('ocurrio un error al insertar la reposicion.');
            res.json({
                "msj":"error en solicitud de Reposicion",
                "success":false,
                "errors":error.message,
                "solicitudes": solicitesCreadas
            });
        }
        
        
    }
    async insertCambioCentro(req,res){
        try {
            //3	Reposición de Examen	201903456	2023-05-01	2023-05-05	1
            await db.connect();
            let cuentaSolicitante = req.params.numeroCuenta;
            let centroDestino = req.params.centroDestino;
            let descripcion = req.body.motivo;
            let nombre_Centro = await db.query(`select nombre_centro from centros_regionales where id_centro = '${centroDestino}';`);
            //console.log(nombre_Centro);
            descripcion = descripcion+'centro Destino:'+nombre_Centro[0]["nombre_centro"];

            var solicitesCreadas = await db.query(
                `select * from Solicitudes_hechas_centro shc
                inner join Solicitudes s on s.id_solicitud = shc.motivo
                where motivo = '4' and id_solicitante = '${cuentaSolicitante}';`);
            let tieneSolicitudes = await this.existeSolicitud(cuentaSolicitante,4);
            console.warn('TIENE SOLICITUDES:::',tieneSolicitudes);
            if(!tieneSolicitudes){
                
                let existe = await estudiantesModel.existeEstudianteByNumeroCuenta(cuentaSolicitante);
                console.log('cuentaSolicitante:',cuentaSolicitante,'existe:',existe)
                if(existe){
                    
                    await db.connect();
                    await db.query(
                        `insert into Solicitudes_hechas_centro(
                            motivo,id_solicitante,fecha_solicitud,fecha_respuesta,
                            id_centro, descripcion
                        )values(
                            4,'${cuentaSolicitante}',getDate(),getDate(),1, '${descripcion}'
                        );`//por defecto solo los de ciudad universitaria (1).
                    );

                    solicitesCreadas = await db.query(
                    `select * from Solicitudes_hechas_centro shc
                    inner join Solicitudes s on s.id_solicitud = shc.motivo
                    where motivo = '4' and id_solicitante = '${cuentaSolicitante}';`);

                    await db.close();
                    
                    

                    let respuesta ={
                        "msj":"Solicitud de CAMBIO DE CENTRO hecha",
                        "success":true,
                        "errors":"",
                        "solicitudes": solicitesCreadas
                    };  
                    console.log('respuesta CAMBIO DE CENTRO:',respuesta);
                    res.json(respuesta);
                }
            }
            else{
                console.log('ocurrio un error al insertar la CAMBIO DE CENTRO.');
                res.json({
                    "msj":"error en solicitud de CAMBIO DE CENTRO",
                    "success":false,
                    "errors":`El estudiante ${cuentaSolicitante} ya tiene solicitudes de Cambio de Centro`,
                    "solicitudes": solicitesCreadas
                });
            }
            
        } catch (error) {
            console.error(error);
            console.log('ocurrio un error al insertar la CAMBIO DE CENTRO.');
            res.json({
                "msj":"error en solicitud de CAMBIO DE CENTRO",
                "success":false,
                "errors":error.message,
                "solicitudes": solicitesCreadas
            });
        }
        
        
    }
    async insertSolicitudPractica(req,res){
        try {
            //3	Reposición de Examen	201903456	2023-05-01	2023-05-05	1
            await db.connect();
            let cuentaSolicitante = req.params.numeroCuenta;
            var solicitesCreadas = await db.query(`select * from Solicitudes_hechas_centro shc
                inner join Solicitudes s on s.id_solicitud = shc.motivo
                where motivo = '5' and id_solicitante = '${cuentaSolicitante}';`);
                
            if(await !this.existeSolicitud(cuentaSolicitante,5)){
                
                let existe = await estudiantesModel.existeEstudianteByNumeroCuenta(cuentaSolicitante);
                console.log('cuentaSolicitante:',cuentaSolicitante,'existe:',existe)
                if(existe){
                    
                    await db.connect();
                    await db.query(
                        `insert into Solicitudes_hechas_centro(motivo,id_solicitante,fecha_solicitud,fecha_respuesta,id_centro)
                        values(
                            5,'${cuentaSolicitante}',getDate(),getDate(),1
                        );`//por defecto solo los de ciudad universitaria (1).
                    );

                    solicitesCreadas = await db.query(`select * from Solicitudes_hechas_centro shc
                    inner join Solicitudes s on s.id_solicitud = shc.motivo
                    where motivo = '5' and id_solicitante = '${cuentaSolicitante}';`);

                    await db.close();
                    
                    

                    let respuesta ={
                        "msj":"Solicitud de Reposicion hecha",
                        "success":true,
                        "errors":"",
                        "solicitudes": solicitesCreadas
                    };  
                    console.log('respuesta Reposicion:',respuesta);
                    res.json(respuesta);
                }
            }
            else{
                console.log('ocurrio un error al insertar la reposicion.');
                res.json({
                    "msj":"error en solicitud de Reposicion",
                    "success":false,
                    "errors":`no existe el numero de cuenta ${cuentaSolicitante}`,
                    "solicitudes": solicitesCreadas
                });
            }
            
        } catch (error) {
            console.error(error);
            console.log('ocurrio un error al insertar la reposicion.');
            res.json({
                "msj":"error en solicitud de Reposicion",
                "success":false,
                "errors":error.message,
                "solicitudes": solicitesCreadas
            });
        }
        
        
    }

}

module.exports = new SolicitudesController();