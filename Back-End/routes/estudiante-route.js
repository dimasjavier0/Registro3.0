const express = require('express');
const estudianteController = require('../controllers/estudiantesController');

const EstudiantesModel = require('../models/estudiantes-model');

const router = express.Router();

router.post('/', EstudiantesModel.createEstudiantes);
router.get('/:numeroCuenta', estudianteController.getEstudianteByNumeroCuenta);


module.exports = router;
