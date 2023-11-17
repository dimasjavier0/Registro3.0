const express = require('express');
const sql = require('mssql');

const app = express();
app.use(express.json());

// Configuración de la conexión a la base de datos
const config = {
    user: 'tuUsuario',
    password: 'tuContraseña',
    server: 'tuServidor', // Puedes usar una dirección IP o un nombre de servidor
    database: 'tuBaseDeDatos',
    options: {
        encrypt: true, // Si estás usando Azure SQL
        trustServerCertificate: true // Solo para desarrollo, no usar en producción
    }
};

// Función para actualizar el correo del estudiante
async function actualizarCorreoEstudiante(identidad) {
    try {
        await sql.connect(config);
        const result = await sql.query`EXEC ActualizarCorreoEstudiante @Identidad=${identidad}`;
        return result;
    } catch (err) {
        throw err;
    }
}

// Endpoint para actualizar el correo
app.post('/actualizarCorreo', async (req, res) => {
    const identidad = req.body.identidad;
    try {
        const result = await actualizarCorreoEstudiante(identidad);
        res.status(200).send('Correo actualizado con éxito');
    } catch (err) {
        res.status(500).send('Error al actualizar el correo: ' + err.message);
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
