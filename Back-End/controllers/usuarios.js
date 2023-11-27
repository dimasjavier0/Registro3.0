const bcrypt = require('bcrypt');
const crypto = require('crypto');
const bd = require('../conections/database');

const correo = require('../controllers/correo');

class Usuarios{
    constructor(){
         // Vincular los métodos a la instancia de Usuarios
         this.manejarSolicitudRecuperacion = this.manejarSolicitudRecuperacion.bind(this);
    }
    
    generarContraseniaProvisional() {
        return crypto.randomBytes(8).toString('hex');
    }

    async hashearContrasenia(contrasenia) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(contrasenia, salt);
    }

    async buscarIdUsuarioPorEmail(email) {
        
        try {
            await db.connect();
            const result = await db.query(`SELECT id_usuario FROM usuarios WHERE correoElectronico = '${email}'`);

            //result.recordset.length > 0 ? result.recordset[0] : null;
            return result[0];
        } finally {
            await db.close();
        }
    }

    async actualizarContraseniaUsuario(idUsuario, contraseniaHasheada) {
        await db.connect();
        try {

            if(idUsuario){
                if(contraseniaHasheada){
                    const result = await db.query(`UPDATE usuarios SET password_hash = '${contraseniaHasheada}' WHERE id_usuario = ${idUsuario}`);
                    console.log('respuesta del SQL',result);
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }

        } finally {
            await db.close();
            return true;
        }
    }

    async manejarSolicitudRecuperacion(req, res) {
        console.log(`= = = = entro al correoRecuperacion: ${JSON.stringify(req.body)} = = = = =`);
        
        const email = req.body.correo;
        console.log('****',email);
        var mensaje = 'No se ha recuparado la contraseña';
        var subject = 'Restablecimiento de contraseña';
        try {
            const usuario = await this.buscarIdUsuarioPorEmail(email);
            
            console.log(usuario);

            if (usuario) {
                const contraseniaProvisional = await this.generarContraseniaProvisional();
                const contraseniaHasheada = await this.hashearContrasenia(contraseniaProvisional);


                const actualizado = await this.actualizarContraseniaUsuario(usuario.id_usuario, contraseniaHasheada);
                
                console.log(actualizado);

                if (actualizado) {
                    
                    mensaje= `Su nueva Contraseña es : ${contraseniaProvisional} (contraseña provisional).`;
                    
                    // Envío de correo
                    await correo.enviarCorreo(email,subject,mensaje);

                    res.json(
                    { 
                        "result": true,
                        "mensaje": `Se ha enviado un correo al correo: ${email}. Con mensaje: ${mensaje}` 
                    });
                } else {
                    mensaje= 'Error al actualizar la contraseña.';
                    res.status(500).json({ "result": false,"mensaje":  mensaje});
                }
            } else {
                res.status(404).json({ "result": false,"mensaje": "El correo no se ha encotrado para un usuario." });
            }
        }catch (error) {
            console.error('Error en la conexión a la base de datos o en la consulta:', error);
            res.status(500).json({ "result": false, "mensaje": "Error interno del servidor." });
        }
    }

}

module.exports = new Usuarios();