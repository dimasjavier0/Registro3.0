const db = require('../conections/database');
const { jsPDF } = require("jspdf");


const obtenerDatosEstudiante = async (numCuenta) => {
    try {
        await sql.connect(config);
        const resultadoEstudiante = await sql.query`SELECT num_cuenta, primer_nombre + ' ' + segundo_nombre as nombre, primer_apellido + ' ' + segundo_apellido as apellido, c.nombre_carrera, cr.nombre_centro, indice_academico from estudiantes e inner join personas p on e.id_persona = p.numero_identidad inner join carreras c on e.id_carrera = c.id_carrera inner join centros_regionales cr on e.id_centro_regional = cr.id_centro WHERE num_cuenta = ${numCuenta}`;
        const resultadoAsignaturas = await sql.query`SELECT a.codigo_asignatura as codigo, a.nombre_asig as nombre, a.unidades_valorativas as uv, me.periodo_academico as periodo, me.nota, CASE WHEN me.nota >= 70 THEN 'APR' ELSE 'RPB' END as observacion from matricula_estudiantes me inner join secciones s on me.id_seccion = s.id_seccion inner join asignaturas a on s.id_asignatura = a.id_asignatura WHERE me.id_estudiante = ${numCuenta}`;
    
        return {
          estudiante: resultadoEstudiante.recordset[0],
          asignaturas: resultadoAsignaturas.recordset
        };
      } catch (err) {
        console.error(err);
      } finally {
        await sql.close();
      }
};

const generarHistorialAcademicoPDF = (estudiante, asignaturas) => {
  // Lógica para generar el PDF
};

exports.generarPDF = async (req, res) => {
  const numCuenta = req.params.numCuenta;
  console.log('Generando Historial Academico');
    const obtenerDatosEstudiante = async (numCuenta) => {
      try {
          

          await sql.connect(config);
          const resultadoEstudiante = await sql.query(
          `SELECT num_cuenta, primer_nombre + ' ' + segundo_nombre as nombre, primer_apellido + ' ' + segundo_apellido as apellido, c.nombre_carrera, cr.nombre_centro, indice_academico from estudiantes e inner join personas p on e.id_persona = p.numero_identidad inner join carreras c on e.id_carrera = c.id_carrera inner join centros_regionales cr on e.id_centro_regional = cr.id_centro WHERE num_cuenta = ${numCuenta}`
          );

          const resultadoAsignaturas = await sql.query(
          `SELECT a.codigo_asignatura as codigo, a.nombre_asig as nombre, a.unidades_valorativas as uv, me.periodo_academico as periodo, me.nota, CASE WHEN me.nota >= 70 THEN 'APR' ELSE 'RPB' END as observacion from matricula_estudiantes me inner join secciones s on me.id_seccion = s.id_seccion inner join asignaturas a on s.id_asignatura = a.id_asignatura WHERE me.id_estudiante = ${numCuenta}`
          );
            
          return {
            estudiante: resultadoEstudiante.recordset[0],
            asignaturas: resultadoAsignaturas.recordset
          };
      } catch (err) {
          console.error(err);
      } finally {
          await sql.close();
      }
      
  };

  const generarHistorialAcademicoPDF = (estudiante, asignaturas) => {
      const doc = new jsPDF();

      
    
      // Configura el título y los detalles del estudiante
      doc.setFontSize(16);
      doc.text("Historial Académico", 20, 20);
      doc.setFontSize(12);
      doc.text(`Cuenta: ${estudiante.numCuenta}`, 20, 30);
      doc.text(`Nombre: ${estudiante.nombre}`, 20, 40);
      doc.text(`Apellido: ${estudiante.apellido}`, 20, 50);
      doc.text(`Carrera Actual: ${estudiante.carrera}`, 20, 60);
    
      // Configura los encabezados de la tabla
      doc.setFontSize(10);
      doc.text("Código", 20, 70);
      doc.text("Nombre", 50, 70);
      doc.text("UV", 130, 70);
      doc.text("Período", 150, 70);
      doc.text("Nota", 170, 70);
    
      // Agrega las asignaturas
      let y = 80;
      asignaturas.forEach(asignatura => {
        doc.text(asignatura.codigo, 20, y);
        doc.text(asignatura.nombre, 50, y);
        doc.text(asignatura.uv.toString(), 130, y);
        doc.text(asignatura.periodo, 150, y);
        doc.text(asignatura.nota.toString(), 170, y);
        y += 10;
      });
    
      // Convierte el documento a un buffer y lo devuelve
      return doc.output("arraybuffer");
  };

  exports.generarPDF = async (req, res) => {
    const numCuenta = req.params.numCuenta;

    try {
      const datos = await obtenerDatosEstudiante(numCuenta);
      if (datos && datos.estudiante && datos.asignaturas) {
        const pdfBuffer = generarHistorialAcademicoPDF(datos.estudiante, datos.asignaturas);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(Buffer.from(pdfBuffer)); // Enviar el PDF como respuesta
      } else {
        res.status(404).send('No se encontraron datos para el estudiante');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al generar el historial académico');
    }
  };
};