// Controlador para recuperación de contraseña (archivo: controllers/recuperacionController.js)

//const Database = require('..\Back-End\conections\database.js');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sql = require('mssql');

const dbConfig = {
  user: 'Grupo',
  password: '1234',
  server: 'localhost',
  database: 'registro',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function conectarDB() {
  let pool = new sql.ConnectionPool(dbConfig);
  await pool.connect();
  return pool;
}

async function cerrarDB(pool) {
  await pool.close();
}

function generarContraseniaProvisional() {
  return crypto.randomBytes(8).toString('hex');
}

async function hashearContrasenia(contrasenia) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(contrasenia, salt);
}

async function buscarUsuarioPorEmail(email) {
  const pool = await conectarDB();
  try {
    const result = await pool.request()
      .input('correo', sql.NVarChar, email)
      .query(`SELECT id_usuario FROM usuarios WHERE correoElectronico = @correo`);
    return result.recordset.length > 0 ? result.recordset[0] : null;
  } finally {
    await cerrarDB(pool);
  }
}

async function actualizarContraseniaUsuario(idUsuario, contraseniaHasheada) {
  const pool = await conectarDB();
  try {
    const result = await pool.request()
      .input('passwordHash', sql.NVarChar, contraseniaHasheada)
      .input('idUsuario', sql.Int, idUsuario)
      .query(`UPDATE usuarios SET password_hash = @passwordHash WHERE id_usuario = @idUsuario`);
    return result.rowsAffected[0];
  } finally {
    await cerrarDB(pool);
  }
}

async function manejarSolicitudRecuperacion(req, res) {
  console.log("= = = = entro al correoRecuperacion.js = = = = =");
  const { email } = req.body;

  try {
  const usuario = await buscarUsuarioPorEmail(email);

  if (usuario) {
    const contraseniaProvisional = generarContraseniaProvisional();
    const contraseniaHasheada = await hashearContrasenia(contraseniaProvisional);
    const actualizado = await actualizarContraseniaUsuario(usuario.id_usuario, contraseniaHasheada);
    
    if (actualizado) {
      // Configuración del transporte de nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'idsunahcu@gmail.com',
            pass: 'mdmw ielt kdak djdx'
        },
        tls: {
            rejectUnauthorized: false
        }
      });

      // Opciones de correo
      const mailOptions = {
        from: 'idsunahcu@gmail.com',
        to: email,
        subject: 'Recuperación de contraseña UNAH',
        text: `Tu contraseña nueva es: ${contraseniaProvisional}.`
      };

      // Envío de correo
      try {
        await transporter.sendMail(mailOptions);
        res.json({ mensaje: 'Se ha enviado un correo con la contraseña provisional.' });
      } catch (error) {
        console.error('Ocurrio un error:', error);
        res.status(500).json({ mensaje: 'Error al enviar el correo.' });
      }
    } else {
      res.status(500).json({ mensaje: 'Error al actualizar la contraseña.' });
    }
  } else {
    res.status(404).json({ mensaje: 'Usuario no encontrado.' });
  }
}catch (error) {
  console.error('Error en la conexión a la base de datos o en la consulta:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
}
}

module.exports = {
  manejarSolicitudRecuperacion
};