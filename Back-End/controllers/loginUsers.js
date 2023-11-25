const sql = require('mssql');
const bcrypt = require('bcrypt');

const config = {
  user: 'asd',
  password: '134',
  server: 'localhost',
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

//funcion para crear usuarios y logins en la base de datos
async function createLoginAndUser(nameLogin, userDataBase) {
  try {
    // Conectar a la base de datos
    await sql.connect(config);

    // Crear el login
    passwordLogin = hashPassword(randomPassword())
    await sql.query(`USE master; CREATE LOGIN ${nameLogin} WITH PASSWORD = '${passwordLogin}'`);

    // Crear el usuario en la base de datos
    await sql.query(`USE ${config.database}; CREATE USER ${nameLogin} FOR LOGIN ${nameLogin}`);

    if(userDataBase === 'docente'){
        //agregar el rol docente a un usuario
        await sql.query(`ALTER ROLE docente ADD MEMBER ${nameLogin}`);
    }
    // Codigo para agregar el rol de estudiante

    return passwordLogin;
  } catch (err) {
    console.error('Error al crear el login y el usuario:', err);
    throw err;
  } finally {
    // Cerrar la conexión
    await sql.close();
  }
}

module.exports = { createLoginAndUser, hashPassword};
