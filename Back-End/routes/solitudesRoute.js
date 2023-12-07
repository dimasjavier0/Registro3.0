const express = require('express');

const router = express.Router();
var solicitudesController = require('../controllers/solitudesController')

/**crear solicitudes reposicion */
router.post('/reposicion/:numeroCuenta', solicitudesController.insertReposicion);



module.exports = router;
