const bd = require('../conections/database');
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
  
  /*Metodo para crear un usuario, y que manda un correo al crearse con las credenciales*/
  async crearUsuario(nombreUsuario, correoElectronico, rol) {
    try {
      console.log('creando Usuario: ',nombreUsuario);
      // Conectar a la base de datos
     let pool =  await mssql.connect(config);

      if (typeof nombreUsuario == "number"){
        nombreUsuario = nombreUsuario.toString();
      }

      const resultado = await pool.query(`SELECT nombre_usuario FROM usuarios WHERE nombre_usuario = '${nombreUsuario}'`);

      const passwordUser = this.generarPasswordProvisional(); //La contraseña que se enviara al correo
      console.log('resultado',resultado);
      if (resultado.length != 0) {
        const passwordHash = await hashPassword(passwordUser);

        var subject = 'Bienvenido a la UNAH';
        var mensaje;

        if (rol == '3') {
          await pool.query(`INSERT INTO usuarios(nombre_usuario, password_hash, correoElectronico, rol)
                          VALUES('${nombreUsuario}', '${passwordHash}', '${correoElectronico}', '3')`);
          
          mensaje = `Se ha creado una cuenta para usted con la siguiente informacion:
                                 Usuario: ${nombreUsuario}
                           Contraseña provisional: ${passwordUser}


                       Piense en el medio ambiente antes de imprimir este correo`;


          correo.enviarCorreo(correoElectronico, subject, mensaje);
        } else if (rol == '2') {
          await pool.query(`INSERT INTO usuarios(nombre_usuario, password_hash, correoElectronico, rol)
                          VALUES('${nombreUsuario}', '${passwordHash}', '${correoElectronico}', '2')`);
          
          mensaje = `Se ha creado una cuenta para usted con la siguiente informacion:
                            Número de cuenta: ${nombreUsuario}
                            Contraseña provisional: ${passwordUser}
      
            Piense en el medio ambiente antes de imprimir este correo.`;

          correo.enviarCorreo(correoElectronico, subject, mensaje);
        }
      } else {
        console.error('Error al crear Usuario');
        throw new Error(`El usuario ${nombreUsuario} ya existe`);
      }

      pool.close();
    } catch (err) {
      console.error('Error al crear el usuario:', err);
      //throw err;
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
  async verificarCredenciales(nombreUsuario, passwordUser, rol) {
    try {
      let nom = nombreUsuario;
      if (typeof nombreUsuario === "number") {
        nombreUsuario = nombreUsuario.toString();
      }
      console.log("ROL::",rol);
      /**para jefe de departamento */
      if(rol == 5){

          //
          /**Jefe */
          //let pool = await mssql.connect(config);
          await bd.connect();
          let resultado = await bd.query(`select count(*) existe FROM jefes_departamentos 
          WHERE id_docente = '${nom}';`);
          let existeJefe = resultado[0]["existe"];
          console.log('resultado',existeJefe);

        if (!existeJefe) {
          throw new Error('El Jefe DEPARTAMENTO no existe o el rol es incorrecto');
        }
        resultado = await bd.query(`select nombre_usuario, password_hash FROM usuarios 
        WHERE nombre_usuario = '${nombreUsuario}' and rol = 3`);

        const usuario = resultado[0];
        const esPasswordCorrecto = await bcrypt.compare(passwordUser, usuario.password_hash);

        if (!esPasswordCorrecto) {
          throw new Error('Contraseña incorrecta');
          }
          let infoLogin= await bd.query(
            `select * from docentes d inner join 
            (select * from usuarios u where ISNULL(TRY_CAST(u.nombre_usuario AS INT), 0) <> 0) as tabla
            on tabla.nombre_usuario = d.num_empleado
            inner join personas p on p.numero_identidad = d.id_persona
            where tabla.nombre_usuario = '${nombreUsuario}';`
          );
          console.log(infoLogin);
          let sesion ={"status":true, "numeroEmpleado":infoLogin[0]["num_empleado"],"identidad":infoLogin[0]["id_persona"]}; 
          console.log('Credenciales Correctas:',sesion);
          return sesion;

          //
      }else{/**para docentes o estudiantes */
        //let pool = await mssql.connect(config);
        await bd.connect();
        const resultado = await bd.query(`select nombre_usuario, password_hash FROM usuarios 
        WHERE nombre_usuario = '${nombreUsuario}' and rol = ${rol}`);

        console.log('resultado:',resultado[0]["nombre_usuario"]);

        if (!resultado[0]["nombre_usuario"]){
          throw new Error('El usuario no existe o el rol es incorrecto');
        }

        const usuario = resultado[0];
        console.log("COMPARACION::passwordUser::",passwordUser,"pasword_hash::",usuario["password_hash"]);
        const esPasswordCorrecto = await bcrypt.compare(passwordUser, usuario["password_hash"]);

        if (!esPasswordCorrecto) {
          throw new Error('Contraseña incorrecta');
        }
        let infoLogin;
        let sesion;
        if(rol==2){
           infoLogin= await bd.query(
            `SELECT e.id_persona identidad, e.num_cuenta numeroCuenta, u.correoElectronico FROM usuarios u 
            inner join estudiantes e on e.num_cuenta = u.nombre_usuario  
            inner join personas p on p.numero_identidad = e.id_persona
            WHERE nombre_usuario= '${usuario["nombre_usuario"]}';`
          );
          sesion ={"status":true, "numeroCuenta":infoLogin[0]["numeroCuenta"],"identidad":infoLogin[0]["identidad"]}; 
        }else{
          if(rol == 3){
            infoLogin= await bd.query(
              `select * from docentes d inner join 
              (select * from usuarios u where ISNULL(TRY_CAST(u.nombre_usuario AS INT), 0) <> 0) as tabla
              on tabla.nombre_usuario = d.num_empleado
              inner join personas p on p.numero_identidad = d.id_persona
              where tabla.nombre_usuario = '${nombreUsuario}';`
            );
            sesion ={"status":true, "numeroCuenta":infoLogin[0]["num_empleado"],"identidad":infoLogin[0]["id_persona"]}; 
          }
        }

        
        console.log(infoLogin);
        
        console.log('Credenciales Correctas:',sesion);
        return sesion;
      } 

      

   } catch (error) {
    console.log(error);
     //throw new Error(`Error en la autenticación: ${err.message}`);
   } finally {
      bd.close();
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
 
