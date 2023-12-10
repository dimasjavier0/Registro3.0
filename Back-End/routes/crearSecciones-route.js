const express = require('express');
const sql = require('mssql');

const router = express.Router();

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

const pool = new sql.ConnectionPool(config);

router.use(async (req, res, next) => {
  try {
    if (!pool.connected) {
      await pool.connect();
    }
    req.pool = pool;
    next();
  } catch (error) {
    errorHandler(res, error);
  }
});

const errorHandler = (res, error) => {
  console.error(error);
  res.status(500).send('Error en el servidor');
};

// Obtener  las asignaturas
router.get('/asignaturas', async (req, res) => {
  try {
    const poolRequest = await req.pool.request();
    const result = await poolRequest.query('SELECT * FROM asignaturas');
    res.json(result.recordset);
  } catch (error) {
    errorHandler(res, error);
  }
});

// Obtener departamentos 
router.get('/departamentos/:asignaturaId', async (req, res) => {
  try {
    const poolRequest = await req.pool.request();
    const result = await poolRequest
      .input('asignaturaId', sql.Int, req.params.asignaturaId)
      .query('SELECT id_dep_academico, nombre FROM departamentos_academicos WHERE id_dep_academico = (SELECT id_dep_academico FROM asignaturas WHERE id_asignatura = @asignaturaId)');
    res.json(result.recordset);
  } catch (error) {
    errorHandler(res, error);
  }
});

// Obtener  docentes
router.get('/docentes/num_empleados', async (req, res) => {
  try {
    const poolRequest = await req.pool.request();
    const result = await poolRequest.query('SELECT num_empleado FROM docentes');
    res.json(result.recordset.map(docente => docente.num_empleado));
  } catch (error) {
    errorHandler(res, error);
  }
});

router.get('/aulas', async (req, res) => {
  try {
    const poolRequest = await req.pool.request();
    const result = await poolRequest.query('SELECT id_aula, numero_aula, id_edificio FROM aulas');
    res.json(result.recordset);
  } catch (error) {
    errorHandler(res, error);
  }
});

router.use((req, res, next) => {
  req.pool.close();
  next();
});

module.exports = router;
