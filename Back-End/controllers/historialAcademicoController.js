const db = require('../conections/database');
const { jsPDF } = require("jspdf");
const sql = require("mssql");
const fs = require('fs');

const imageToBase64 = (path) => {
  return fs.readFileSync(path, 'base64');
};

//Aca poner la ruta de la foto png
const imagePath = 'C:\\Users\\Owner\\Desktop\\Escudo_de_la_UNAH.svg.png';

const obtenerDatosEstudiante = async (numCuenta) => {
  try {
    await db.connect();
    console.log("Número de cuenta recibido:", numCuenta);

    const resultadoEstudiante = await db.query(`SELECT num_cuenta, 
      (primer_nombre + ' ' + segundo_nombre) as nombre, 
      (primer_apellido + ' ' + segundo_apellido) as apellido, 
      c.nombre_carrera, cr.nombre_centro, indice_academico 
      FROM estudiantes e 
      INNER JOIN personas p ON e.id_persona = p.numero_identidad 
      INNER JOIN carreras c ON e.id_carrera = c.id_carrera 
      INNER JOIN centros_regionales cr ON e.id_centro_regional = cr.id_centro 
      WHERE num_cuenta = '${numCuenta}'`);

    console.log("Resultado de la consulta de estudiante:", resultadoEstudiante);

    const resultadoAsignaturas = await db.query(`select a.nombre_asig, a.unidades_valorativas as uv, me.nota, aPAC.id_periodo as periodo
      from matricula_estudiantes me
      inner join secciones s on s.id_seccion = me.id_seccion
      inner join asignaturas a on a.id_asignatura = s.id_asignatura
      inner join Asignaturas_PAC aPAC on aPAC.id_asignatura_pac = s.id_asignatura
      where me.id_estudiante = '${numCuenta}'`);

    console.log("Resultado de la consulta de asignaturas:", resultadoAsignaturas);

    // Retorna un objeto con las propiedades estudiante y asignaturas
    return {
      estudiante: resultadoEstudiante,
      asignaturas: resultadoAsignaturas
    };
  } catch (err) {
    console.error("error al obtener datos del estudiante.. :c", err);

    // En caso de error, también retorna un objeto con las propiedades estudiante y asignaturas, pero con valores vacíos
    return {
      estudiante: [],
      asignaturas: []
    };
  } finally {
    await db.close();
  }
};

exports.generarPDF = async (req, res) => {
  console.log("Petición recibida para generar PDF");
  const numCuenta = req.params.numCuenta;
  console.log("Generando PDF para:", numCuenta);

  try {
    const datos = await obtenerDatosEstudiante(numCuenta);
    console.log("Datos obtenidos para", numCuenta, ":", datos);

    if (datos && datos.estudiante && datos.estudiante.length > 0 && datos.asignaturas && datos.asignaturas.length > 0) {
      console.log("Generando el PDF...");
      const estudiante = datos.estudiante[0];
      const asignaturas = datos.asignaturas;

      const pdfBuffer = generarHistorialAcademicoPDF(estudiante, asignaturas);

      console.log("PDF generado, enviando respuesta...");
      res.setHeader('Content-Type', 'application/pdf');
      res.send(Buffer.from(pdfBuffer));
    } else {
      console.log("No se encontraron datos para el estudiante:", numCuenta);
      res.status(404).send('No se encontraron datos para el estudiante');
    }
  } catch (error) {
    console.error("Error al generar el PDF para la cuenta", numCuenta, ":", error);
    res.status(500).send('Error al generar el historial académico');
  }
};

const generarHistorialAcademicoPDF = (estudiante, asignaturas) => {
  const doc = new jsPDF();
  const logo = imageToBase64(imagePath);

  // Configurar el título del documento y los encabezados
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('UNIVERSIDAD NACIONAL AUTÓNOMA DE HONDURAS', 105, 10, null, null, 'center');
  doc.setFontSize(10);
  doc.text('DIRECCIÓN DE INGRESOS PERMANENCIA Y PROMOCIÓN', 105, 16, null, null, 'center');
  doc.text('HISTORIAL ACADÉMICO', 105, 22, null, null, 'center');

  
  doc.addImage(logo, 'PNG', 30, 5, 12, 17);


  // Información del estudiante con rectángulos grises y esquinas redondeadas
  doc.setFillColor(224, 224, 224); // Gris claro
  doc.roundedRect(20, 28, 90, 18, 2, 2, 'F');
  doc.roundedRect(111, 28, 90, 18, 2, 2, 'F');

  // Asegurar que la información del estudiante esté en mayúsculas y no sea undefined
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Cuenta: ${estudiante.num_cuenta ? estudiante.num_cuenta.toUpperCase() : ''}`, 22, 33);
  doc.text(`Nombre: ${estudiante.nombre ? estudiante.nombre.toUpperCase() : ''}`, 22, 38);
  doc.text(`Apellido: ${estudiante.apellido ? estudiante.apellido.toUpperCase() : ''}`, 22, 43);
  doc.text(`Carrera Actual: ${estudiante.nombre_carrera ? estudiante.nombre_carrera.toUpperCase() : ''}`, 122, 33);
  doc.text(`Centro: ${estudiante.nombre_centro ? estudiante.nombre_centro.toUpperCase() : ''}`, 122, 38);
  doc.text(`Índice: ${estudiante.indice_academico ? estudiante.indice_academico.toString().toUpperCase() : 'NO DISPONIBLE'}`, 122, 43);

  // Rectángulo gris detrás del nombre de la carrera
  doc.setFillColor(224, 224, 224);
  doc.roundedRect(20, 50, 180, 6, 1, 1, 'F');
  
  // Nombre de la carrera en mayúsculas y centrado
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text(estudiante.nombre_carrera.toUpperCase(), 105, 55, null, null, 'center');

  // Año y línea divisoria
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('2019', 105, 62, null, null, 'center');
  doc.setLineWidth(0.2);
  doc.line(20, 64, 190, 64); // Cambia las coordenadas según sea necesario

  // Encabezados de las columnas en mayúsculas
  doc.setTextColor(0);
  doc.text('CÓDIGO', 20, 70);
  doc.text('NOMBRE', 50, 70);
  doc.text('UV', 120, 70);
  doc.text('PERÍODO', 140, 70);
  doc.text('NOTA', 160, 70);
  doc.text('OBS', 180, 70);

  // Datos de las asignaturas
  let y = 75;
  let totalAprobadas = 0;
  asignaturas.forEach(asignatura => {
    let obs = asignatura.nota >= 65 ? 'APR' : 'RPB'; // Establece APR o RPB según la nota
    if (obs === 'APR') totalAprobadas++;
    doc.text(asignatura.codigo_asignatura || '', 20, y);
    doc.text(asignatura.nombre_asig || '', 50, y, { maxWidth: 60 });
    doc.text(asignatura.uv.toString() || '', 120, y);
    doc.text(asignatura.periodo.toString() || '', 140, y);
    doc.text(asignatura.nota.toString() || '', 160, y);
    doc.text(obs, 180, y);
    y += 5;
  });

  doc.setFont('helvetica', 'bold');
  doc.text(`Total Aprobadas: ${totalAprobadas}`, 20, y);

  // Pie de página en mayúsculas y centrado
  doc.setFontSize(8);
  doc.text('La Educación es la Primera Necesidad de la República'.toUpperCase(), 105, 285, null, null, 'center');
    let pageCount = doc.internal.getNumberOfPages(); // Obtiene el número total de páginas
  doc.text(`Página 1 de ${pageCount}`, 20, 290);
  // Retorna el PDF como un buffer
  return doc.output('arraybuffer');
};
