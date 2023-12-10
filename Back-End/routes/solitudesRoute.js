const express = require('express');

const router = express.Router();
var solicitudesController = require('../controllers/solitudesController')

/**crear solicitudes reposicion */
router.post('/reposicion/:numeroCuenta', solicitudesController.insertReposicion);
router.post('/cancelacionExepcional/:numeroCuenta', solicitudesController.insertCancelacionExepcional);
router.post('/cambioCarrera/:numeroCuenta/:carreraDestino', solicitudesController.insertcambioCarrera);
router.post('/cambioCentro/:numeroCuenta/:centroDestino', solicitudesController.insertCambioCentro);
router.post('/solicitudPractica/:numeroCuenta', solicitudesController.insertSolicitudPractica);



module.exports = router;
