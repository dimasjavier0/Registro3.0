const nodemailer = require('nodemailer');
const db = require('../conections/database');

class Correo{
    constructor(){
        /**configuracion */
        this.mailOptions = {
            from: 'idsunahcu@gmail.com', 
            to: 'papardosmith@gmail.com', 
            subject: 'probando',
            text: 'test 1 probado.'
        };

        /**analogo a la conexion */
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'idsunahcu@gmail.com', 
                pass: 'mdmw ielt kdak djdx'  
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    async enviarCorreo(mail,subject,msjToSend){
        this.mailOptions.to = mail;
        this.mailOptions.subject = subject;//'<<RESULTADOS UNAH>>'
        this.mailOptions.text = msjToSend;

        /** metodo de la conexion para enviar correo */
        await this.transporter.sendMail(this.mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Correo enviado: ' + info.response);
            }
        });
        
    }
    
}


module.exports = new Correo();