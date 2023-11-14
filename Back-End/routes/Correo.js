/*const mysql = require('mysql');
const sgMail = require('@sendgrid/mail');

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'registro'
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos!');
});

// Función para obtener la nota más reciente y el correo electrónico del aspirante
function obtenerNotaYCorreo(callback) {
  // Seleccionar la nota más reciente y el correo del aspirante asociado
  const query = `
    SELECT a.id_aspirante, p.correo, r.nota
    FROM resultados_examen_admision r
    JOIN aspirantes a ON r.id_aspirante = a.id_aspirante
    JOIN personas p ON a.id_persona = p.numero_identidad
    ORDER BY r.FechaExamen DESC
    LIMIT 1
  `;
  connection.query(query, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length > 0) {
      return callback(null, results[0]);
    } else {
      return callback(new Error('No se encontraron datos'), null);
    }
  });
}

// Configurar la API key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Obtener la nota y el correo, y enviar el correo
obtenerNotaYCorreo((err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const { correo, nota } = data;
  const aprobado = nota >= 700;
  const subject = aprobado ? 'Felicidades, aprobaste' : 'No aprobaste';
  const text = `Tu nota obtenida es: ${nota}`;
  const html = `<strong>${text}</strong>`;

  const msg = {
    to: correo, // Usar el correo obtenido de la base de datos
    from: 'remitente@example.com', // Cambia al remitente real
    subject,
    text,
    html,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Correo enviado');
    })
    .catch((error) => {
      console.error(error);
    });
});*/

const mysql = require('mysql');
const mailgun = require('mailgun-js');

// Configurar la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'registro',
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos!');
});

// Configurar la API key y el dominio de Mailgun
const mg = mailgun({ apiKey: 'tu_api_key', domain: 'tu_dominio' });

// Función para obtener la nota más reciente y el correo electrónico del aspirante
function obtenerNotaYCorreo(callback) {
  // Resto del código permanece igual
}

// Obtener la nota y el correo, y enviar el correo a través de Mailgun
obtenerNotaYCorreo((err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const { correo, nota } = data;
  const aprobado = nota >= 700;
  const subject = aprobado ? 'Felicidades, aprobaste' : 'No aprobaste';
  const text = `Tu nota obtenida es: ${nota}`;
  const html = `<strong>${text}</strong>`;

  const emailData = {
    from: 'remitente@example.com',
    to: correo,
    subject,
    text,
    html,
  };

  // Enviar el correo a través de Mailgun
  mg.messages().send(emailData, (error, body) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Correo enviado con Mailgun');
    }
  });
});
