const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'idsunahcu@gmail.com', 
        pass: 'mdmw ielt kdak djdx'  
    }
});

let mailOptions = {
    from: 'idsunahcu@gmail.com', 
    to: 'papardosmith@gmail.com', 
    subject: 'probando',
    text: 'test 1 probado.'
};

    if (error) {
        console.log(error);
    } else {
        console.log('Correo enviado: ' + info.response);
    }
});