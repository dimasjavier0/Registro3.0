
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [idDocente, setIdDocente] = useState('');
  const [clasesAsignadas, setClasesAsignadas] = useState([]);
  const [idSeccion, setIdSeccion] = useState('');

  const obtenerClasesAsignadas = async () => {
    try {
      const response = await axios.get(`http://localhost:8888/api/docentes/${idDocente}/clases`);
      setClasesAsignadas(response.data);
    } catch (error) {
      console.error('Error al obtener clases asignadas:', error);
    }
  };

  //Descargar listado de alumnos

  const handleDescargarListado = async () => {
    try {
      const response = await axios.get(`http://localhost:8888/ap/Listado/${idSeccion}/estudiantes
      `, {
        responseType: 'blob', // Indica que la respuesta es un archivo binario
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `estudiantes_seccion_${idSeccion}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar estudiantes matriculados:', error);
      // Manejo del error
    }
  };

  return (
    <div className=''>
      <h1 className='text-4xl text-red-800 font-black mb-4 mt-28 text-center font-lato'>Clases Asignadas</h1>
      <label>ID del Docente:</label>
      <input 
      className='border-2  border-rose-800 mb-20 ml-9 p-4'
      type="text" value={idDocente} onChange={(e) => setIdDocente(e.target.value)} />
      <button 
      className='bg-blue-500 ml-20 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-4'
      onClick={obtenerClasesAsignadas}>Obtener Clases</button>

<input
          className="border-2  border-rose-800 mb-20 ml-9 p-4"
          type="text"
          placeholder="Ingrese ID de Sección Para Descargar Listado"
          value={idSeccion}
          onChange={(e) => setIdSeccion(e.target.value)}
        />
        <button
          className="bg-blue-500 ml-20 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-4"
          onClick={handleDescargarListado}
        >
        Descargar Listado
        </button>


      <table className='min-w-full bg-white border border-gray-300'>
        <thead>
          <tr>
          <th className='bg-blue-100  border uppercase border-slate-300 text-left px-6 py-3 text-gray-600'>ID</th>
                    <th className='bg-blue-100  border uppercase border-slate-300 text-left px-6 py-3 text-gray-600'>Clase</th>
                    <th className='bg-blue-100  border uppercase border-slate-300 text-left px-6 py-3 text-gray-600'>Sección</th>
                    <th className='bg-blue-100  border uppercase border-slate-300 text-left px-6 py-3 text-gray-600'>Hora</th>
          </tr>
        </thead>
        <tbody>
          {clasesAsignadas.map((clase) => (
            <tr key={clase.id_seccion}>
              <td>{clase.id_asignatura}</td>
              <td>{clase.nombre_asig}</td>
              <td>{clase.id_seccion}</td>
              <td>{clase.hora_inicio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default App;
