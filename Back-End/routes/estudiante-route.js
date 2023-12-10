const express = require('express');
const estudianteController = require('../controllers/estudiantesController');
const estudiantesModel = require('../models/estudiantes-model');


const router = express.Router();

router.get('/:id_usuario', estudianteController.getEstudianteByNumeroCuenta);

/**RF 7: completado, implementar con Frontend */
router.post('/',estudiantesModel.createEstudiantes);


module.exports = router;
