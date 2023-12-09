const express = require('express');
const sql = require('mssql');
const router = express.Router();



// Función para obtener el índice académico del estudiante
async function obtenerIndiceAcademico(numCuenta) {
    try {

        console.log("Número de cuenta recibido en función:", numCuenta); // Para depuración

        const request = new sql.Request();
        request.input('numCuentaParam', sql.NVarChar(11), numCuenta);

        const result = await request.query(`
            SELECT TOP 1 he.indice_de_periodo 
            FROM historial_estudiante he
            INNER JOIN periodos_academicos pa ON he.id_periodo = pa.id_periodo
            WHERE he.num_cuenta = @numCuentaParam
            ORDER BY pa.fecha_fin DESC
        `);

        console.log("Resultados de la consulta:", result.recordset);

        if (result.recordset.length > 0) {
            return result.recordset[0].indice_de_periodo;
        } else {
            throw new Error('Índice académico no encontrado para el estudiante');
        }
    } catch (err) {
        console.error('Error al obtener el índice académico:', err);
        throw err;
    }
}
// Función para verificar la elegibilidad para la matrícula

async function esElegibleParaMatricula(indiceAcademico, fechaActual) {
    try {
        const result = await sql.query`
            SELECT * FROM dias_matricula 
            WHERE (indice_inicial IS NULL OR indice_inicial <= ${indiceAcademico}) 
              AND (indice_final IS NULL OR indice_final >= ${indiceAcademico})`;

        if (result.recordset.length > 0) {
            for (let rango of result.recordset) {
                let inicio = new Date(rango.dia_comienzo_matricula);
                let fin = new Date(rango.dia_final_matricula);
                fin.setHours(23, 59, 59, 999); // Ajustar la hora final del día

                if (fechaActual >= inicio && fechaActual <= fin) {
                    if (rango.indice_inicial === null && rango.indice_final === null) {
                        // Lógica específica para días sin restricción de índice
                        // Por ejemplo, permitir solo a estudiantes de nuevo ingreso
                        // return esNuevoIngreso(estudiante); // Esta sería una función hipotética
                        continue; // O simplemente continuar con el siguiente rango
                    } else if (indiceAcademico >= rango.indice_inicial && indiceAcademico <= rango.indice_final) {
                        return true; // El estudiante es elegible para matricularse
                    }
                }
            }
        }
        return false; // El estudiante no es elegible para matricularse
    } catch (err) {
        console.error('Error al verificar la elegibilidad para la matrícula:', err);
        throw err;
    }
}



// Función para registrar la matrícula (hipotética)
async function registrarMatricula(idEstudiante, idProcesoMatricula) {
    // ... (implementación de la función)
}


router.post('/matricular-estudiante', async (req, res) => {
    try {
        console.log("Cuerpo de la solicitud recibido:", req.body); // Para depuración
        const { numCuenta, idProcesoMatricula } = req.body;

        console.log("Antes de obtener el índice académico");
        const indiceAcademico = await obtenerIndiceAcademico(numCuenta);
        console.log("Índice académico:", indiceAcademico);

        const fechaActual = new Date();
        console.log("Fecha actual:", fechaActual);

        console.log("Antes de verificar la elegibilidad");
        const esElegible = await esElegibleParaMatricula(indiceAcademico, fechaActual);
        console.log("Después de verificar la elegibilidad");

        if (esElegible) {
            console.log("Antes de registrar la matrícula");
            await registrarMatricula(numCuenta, idProcesoMatricula);
            res.status(200).send('Matrícula realizada con éxito');
        } else {
            res.status(400).send('El estudiante no es elegible para matricularse en esta fecha');
        }
    } catch (err) {
        console.error("Error en el proceso de matrícula:", err);
        res.status(500).send('Error al realizar la matrícula');
    }
});


module.exports = router;




