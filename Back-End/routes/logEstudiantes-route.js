const express = require('express');
const router = express.Router();
const logEstudianteController = require('../controllers/logEstudianteController');


router.post('/', async (req, res) => {
    const { nombreUsuario, passwordUser, rol } = req.body;
  
    try {
      const userLogin = new UserAndLogin ();
      await userLogin.verificarCredenciales(nombreUsuario, passwordUser, rol);
      res.status(200).json({ mensaje: 'Autenticación exitosa' });
    } catch (error) {
      console.error('Error en la autenticación:', error.message);
  
      // Manejar diferentes tipos de errores de manera más específica
      if (error.message.includes('El usuario no existe')) {
        res.status(404).json({ mensaje: 'El usuario no existe' });
      } else if (error.message.includes('La contraseña es incorrecta')) {
        res.status(401).json({ mensaje: 'La contraseña es incorrecta' });
      } else {
        res.status(500).json({ mensaje: 'Error en la autenticación' });
      }
    }
  });
module.exports = router;