const express = require('express');
const router = express.Router();
const logEstudianteController = require('../controllers/logEstudianteController');


router.post('/logES', logEstudianteController.loginUser);

module.exports = router;

