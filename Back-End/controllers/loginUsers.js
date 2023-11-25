const sql = require('mssql');
const bcrypt = require('bcrypt');

const config = {
  user: 'sa',
  password: '1234',
  server: 'DESKTOP-9JI7NS5',
  database: 'registro',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

function randomPassword() {
  const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';

  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * caracteres.length);
    password += caracteres.charAt(randomIndex);
  }

  return password;
}

// Función para hashear una contraseña
async function hashPassword(password) {
  try {
    // Genera un salt (valor aleatorio) para aumentar la seguridad del hash
    const salt = await bcrypt.genSalt(10);

    // Hashea la contraseña con el salt
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    throw new Error('Error al hashear la contraseña: ' + error.message);
  }
}

// Función para crear usuarios y logins en la base de datos
async function createLoginAndUser(nameLogin, correoElectronico, userDataBase) {
  let pool;
  try {
    const nombreLogin = nameLogin.toString();

    // Conectar a la base de datos
    pool = await sql.connect(config);

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    passwordUser = randomPassword(); //La contraseña que se enviara al correo

    try {
      // Crear el login
      const passwordLogin = await hashPassword(passwordUser);
      await sql.query(`USE master;`);
      await sql.query(`CREATE LOGIN [${nombreLogin}] WITH PASSWORD = '${passwordLogin}';`);

      // Crear el usuario en la base de datos
      await sql.query(`USE ${config.database}; CREATE USER [${nombreLogin}] FOR LOGIN [${nombreLogin}];`);

      if (userDataBase === 'docente') {
        // Agregar el rol docente a un usuario
        await sql.query(`ALTER ROLE docente ADD MEMBER [${nombreLogin}];`);

        await sql.query(`INSERT INTO usuarios(nombre_usuario, password_hash, correoElectronico)
                        VALUES('${nombreLogin}', '${passwordLogin}', '${correoElectronico}')`);
      } // Código para agregar el rol de estudiante

      await transaction.commit();

    } catch (errConsulta) {
      console.error('Error al crear el login y el usuario:', errConsulta);
      await transaction.rollback();
      throw errConsulta;
    }
  } catch (errConexion) {
    throw errConexion;
  } finally {
    // Cerrar la conexión
    if (pool) await pool.close();
  }
}

module.exports = {createLoginAndUser};
