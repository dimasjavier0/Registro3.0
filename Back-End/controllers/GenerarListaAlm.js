const exceljs = require('exceljs');
const mssql = require('mssql');

const config = {
  user: 'asd',
  password: '134',
  server: 'localhost',
  database: 'registro',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

class EstudianteController {
  static async obtenerEstudiantesMatriculados(idSeccion) {
    try {
      const pool = await mssql.connect(config);

      const result = await pool
        .request()
        .input('idSeccion', mssql.Int, idSeccion)
        .query(`
          SELECT p.primer_nombre, p.segundo_nombre, p.primer_apellido, segundo_apellido, e.num_cuenta, m.id_seccion, a.nombre_asig,
          s.hora_inicio
          FROM personas p
          JOIN estudiantes e ON p.numero_identidad = e.id_persona
          JOIN matricula_estudiantes m ON e.num_cuenta = m.id_estudiante
          JOIN secciones s ON s.id_seccion = m.id_seccion
          JOIN asignaturas a ON a.id_asignatura = s.id_asignatura
          WHERE m.id_seccion = @idSeccion
        `);

      return result.recordset;
    } catch (error) {
      console.error('Error al obtener estudiantes matriculados:', error);
      throw error;
    } finally {
      await mssql.close();
    }
  }

  static async descargarEstudiantesMatriculados(idSeccion) {
    try {
      const estudiantesMatriculados = await this.obtenerEstudiantesMatriculados(idSeccion);

      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('Estudiantes Matriculados');

      // Encabezados de la hoja de cálculo
      worksheet.columns = [
        { header: 'Primer Nombre', key: 'primer_nombre', width: 15 },
        { header: 'Segundo Nombre', key: 'segundo_nombre', width: 15 },
        { header: 'Primer Apellido', key: 'primer_apellido', width: 15 },
        { header: 'Segundo Nombre', key: 'segundo_apellido', width: 15 },
        { header: 'Cuenta', key: 'num_cuenta', width: 15 },
        { header: 'Seccion', key: 'id_seccion', width: 15 },
        { header: 'Asignatura', key: 'nombre_asig', width: 15 },
        { header: 'Hora', key: 'hora_inicio', width: 15 },
      ];

      // Agregar datos a la hoja de cálculo
      worksheet.addRows(estudiantesMatriculados);

      // Guardar el archivo Excel
      const fileName = `estudiantes_seccion_${idSeccion}.xlsx`;
      await workbook.xlsx.writeFile(fileName);
      return { fileName };
    } catch (error) {
      console.error('Error al obtener estudiantes matriculados:', error);
      throw error;
    }
  }
}

module.exports = EstudianteController;
