const db = require('../conections/database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

class UserAndLogin{
  constructor() {};

  /*Metodo para crea una contraseña provisional*/
  generarPasswordProvisional() {
    return crypto.randomBytes(8).toString('hex'); // Genera una cadena hex segura
  }
  
  /*Metodo para crear un usuario*/
  async crearUsuario(nombreUsuario, correoElectronico, rol) {
    try {
      // Conectar a la base de datos
      await db.connect();

      const nombreLogin = nombreUsuario.toString();

      const resultado = await db.query(`SELECT nombre_usuario FROM usuarios WHERE nombre_usuario = '${nombreLogin}'`);

      const passwordUser = this.generarPasswordProvisional(); //La contraseña que se enviara al correo

      if (resultado.length === 0) {
        const passwordHash = await hashPassword(passwordUser);

        if (rol === 'docente') {
          await db.query(`INSERT INTO usuarios(nombre_usuario, password_hash, correoElectronico, rol)
                          VALUES('${nombreLogin}', '${passwordHash}', '${correoElectronico}', 'docente')`);
        } else if (rol === 'estudiante') {
          await db.query(`INSERT INTO usuarios(nombre_usuario, password_hash, correoElectronico, rol)
                          VALUES('${nombreLogin}', '${passwordHash}', '${correoElectronico}', 'estudiante')`);
        }
      } else {
        throw new Error(`El usuario ${nombreLogin} ya existe`);
      }

      console.log(passwordUser);
      db.close();
    } catch (err) {
      console.error('Error al crear el usuario:', err);
      throw err;
    }
  }

  /*Metodo para cambiar el password de un login y user en la base de datos*/
  async cambiarPassword(nombreUsuario, nuevaPassword) {
    try {
      const nombreLogin = nombreUsuario.toString();

      // Conectar a la base de datos
      await db.connect();

      const resultado = await db.query(`SELECT nombre_usuario FROM usuarios WHERE nombre_usuario = '${nombreLogin}'`);

      if (resultado.length > 0) {
        const passwordLogin = await hashPassword(nuevaPassword);

        await db.query(`UPDATE usuarios 
                        SET password_hash = '${passwordLogin}'
                        WHERE nombre_usuario = '${nombreLogin}';`);
      } else {
        throw new Error('El usuario no existe');
      }

      db.close();

    } catch (err) {
      console.error('Error cambiar el password:', err);
      throw err;
    }
  }

  async verificarCredenciales(nombreUsuario, passwordUser, rol){
    try{
      const nombreLogin = nombreUsuario.toString();
      await db.connect();

      const resultado = await db.query(`SELECT nombre_usuario FROM usuarios 
                                        WHERE nombre_usuario = '${nombreLogin}' and rol = '${rol}'`);
      
      if (resultado.length === 0){
        throw new Error('El usuario no existe');
      }else {
        const passwordBase = await db.query(`SELECT password_hash FROM usuarios 
                                            WHERE nombre_usuario = '${nombreLogin}' and rol = '${rol}'`);

        //Verificar la contraseña 
        bcrypt.compare(passwordUser, passwordBase[0].password_hash, (err, result) => {
          if (err) {
            throw new Error('Error al comparar las contraseñas:', err);
          }

          if (result) {
            console.log('La contraseña es correcta');
          } else {
           throw new Error('La contraseña es incorrecta');
          }
        });
        db.close();
      }

    }catch (err){
      throw err;
    }
  }
}

// Función para hashear una contraseña
async function hashPassword(password) {
  try {
    // Genera un salt (valor aleatorio) para aumentar la seguridad del hash
    const salt = await bcrypt.genSalt(10);

    // Hashea la contraseña con el salt
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (err) {
    throw new Error('Error al hashear la contraseña: ', err);
  }
};

module.exports = {UserAndLogin};
// const userLogin = new UserAndLogin();

// function ejecutar(){
//   try {
//     //userLogin.crearUsuario(2020234, 'mi@gmail.com', 'docente');
//     userLogin.verificarCredenciales(2020234, 'mi1234', 'docente');
//     //userLogin.cambiarPassword(2020234, 'mi1234')
//   } catch (error) {
//     console.log(error);
//   }
// };

// ejecutar();
