//const db = require('../conections/database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mssql = require('mssql');
const correo = require('./correo');
const config = {
  user: 'Grupo',
  password: '1234',
  server: 'localhost',
  database: 'Registro2',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    
  }
};


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
     let pool =  await mssql.connect(config);

      if (typeof nombreUsuario == "number"){
        nombreUsuario = nombreUsuario.toString();
      }

      const resultado = await pool.query(`SELECT nombre_usuario FROM usuarios WHERE nombre_usuario = '${nombreUsuario}'`);

      const passwordUser = this.generarPasswordProvisional(); //La contraseña que se enviara al correo

      if (resultado.length != 0) {
        const passwordHash = await hashPassword(passwordUser);

        var subject = 'Bienvenido a la UNAH';
        var mensaje;

        if (rol === 'docente') {
          await pool.query(`INSERT INTO usuarios(nombre_usuario, password_hash, correoElectronico, rol)
                          VALUES('${nombreUsuario}', '${passwordHash}', '${correoElectronico}', 'docente')`);
          
          mensaje = `Se ha creado una cuenta para usted con la siguiente informacion:
                                 Usuario: ${nombreUsuario}
                           Contraseña provisional: ${passwordUser}


                       Piense en el medio ambiente antes de imprimir este correo`;




          correo.enviarCorreo(correoElectronico, subject, mensaje);
        } else if (rol === 'estudiante') {
          await pool.query(`INSERT INTO usuarios(nombre_usuario, password_hash, correoElectronico, rol)
                          VALUES('${nombreUsuario}', '${passwordHash}', '${correoElectronico}', 'estudiante')`);
          
          mensaje = `Se ha creado una cuenta para usted con la siguiente informacion:
                            Número de cuenta: ${nombreUsuario}
                            Contraseña provisional: ${passwordUser}
      
            Piense en el medio ambiente antes de imprimir este correo.`;

          correo.enviarCorreo(correoElectronico, subject, mensaje);
        }
      } else {
        throw new Error(`El usuario ${nombreUsuario} ya existe`);
      }

      pool.close();
    } catch (err) {
      console.error('Error al crear el usuario:', err);
      throw err;
    }
  }

  /*Metodo para cambiar el password de un usuario*/
  async cambiarPassword(nombreUsuario, nuevaPassword) {
    try {
      if (typeof nombreUsuario == "number"){
        nombreUsuario = nombreUsuario.toString();
      }

      // Conectar a la base de datos
      await pool.connect(config);

      const resultado = await pool.query(`SELECT nombre_usuario FROM usuarios WHERE nombre_usuario = '${nombreUsuario}'`);

      if (resultado.length > 0) {
        const passwordLogin = await hashPassword(nuevaPassword);

        await pool.query(`UPDATE usuarios 
                        SET password_hash = '${passwordLogin}'
                        WHERE nombre_usuario = '${nombreUsuario}';`);
      } else {
        throw new Error('El usuario no existe');
      }

      pool.close();

    } catch (err) {
      console.error('Error cambiar el password:', err);
      throw err;
    }
  }
//VALIDAR CREDENCIALES
  async verificarCredenciales(nombreUsuario, passwordUser, rol){
    try{
      if (typeof nombreUsuario == "number"){
        nombreUsuario = nombreUsuario.toString();
      }

      let pool = await mssql.connect(config);

      const resultado = await pool.query(`SELECT nombre_usuario FROM usuarios 
                                        WHERE nombre_usuario = '${nombreUsuario}' and rol = '${rol}'`);
      
      if (resultado.length == 0){
        throw new Error('El usuario no existe');
      }else {
        const passwordBase = await pool.query(`SELECT password_hash FROM usuarios 
                                            WHERE nombre_usuario = '${nombreUsuario}' and rol = '${rol}'`);

                                            //const hashedPasswordFromDB = passwordBase[0].password_hash;
        //Verificar la contraseña 
      await  bcrypt.compare(passwordUser, passwordBase, (err, result) => {
         
        });
        const token = generateAccessToken();
        res.json({ token, nombreUsuario: nombreUsuario });
       // pool.close();
      }

    }catch (err){
      
    }
  }
}

// Función para hashear una contraseña
async function hashPassword(password) {
  try {
    // Genera un salt (valor aleatorio) para aumentar la seguridad del hash
    const salt = await bcrypt.genSalt(10);
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
 
