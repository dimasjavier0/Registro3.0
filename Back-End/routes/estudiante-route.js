const express = require('express');
const estudianteController = require('../controllers/estudiantesController');



const router = express.Router();

router.get('/:id_usuario', estudianteController.getEstudianteByNumeroCuenta);


module.exports = router;