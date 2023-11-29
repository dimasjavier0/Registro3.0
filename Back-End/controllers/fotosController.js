const mssql = require('mssql');

const fotosController = {
    subirFotos: async (req, res) => {
        try {
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
        await mssql.connect(config);

            const promises = req.files.map(async (file) => {
            const id_estudiante = req.body.id_estudiante;

            // Insertar en la tabla fotos_estudiantes
            const result = await mssql.query`
            INSERT INTO fotos_estudiantes (id_estudiante, fotografia)
            VALUES (${id_estudiante}, ${file.buffer})
            `;

            return result;
        });
        await Promise.all(promises);

        res.json({ success: true, message: 'Fotos subidas con éxito.' });
        } catch (error) {
        console.error('Error al subir las fotos:', error);
        res.status(500).json({ success: false, message: 'Error al subir las fotos.' });
        } finally {
        await mssql.close();
        }
    },
};

module.exports = fotosController;
