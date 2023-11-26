const express = require('express');
const estudianteController = require('../controllers/estudiantesController');

const router = express.Router();

router.get('/:numeroCuenta', estudianteController.getEstudianteByNumeroCuenta);

module.exports = router;
