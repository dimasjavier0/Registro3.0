import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse'; // Importa la biblioteca papaparse
//import { Link } from 'react-router-dom';

function SubirCsv() {
  const [csvData, setCsvData] = useState([]); // Estado para almacenar los datos CSV
  const [error, setError] = useState(null);

    const handleLimpiarTb = () => {
      setError(null);
      document.getElementById('Tabla').value = ([]);
      setCsvData([]);
  };

  const handleFileUpload = (file) => {
    const results = [];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (event) => {
        const csvText = event.target.result;
  
        // Procesar 
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false, // Desactivar la conversión dinámica
          complete: (result) => {
            const data = result.data;
            
            // Verificar si los nombres de columna son correctos
            const expectedColumns = ['id', 'nota', 'tipoExamen'];
            const columns = Object.keys(data[0]);

            if (!expectedColumns.every((col) => columns.includes(col)) || !columns.every((col) => expectedColumns.includes(col))) {
              setError('El archivo CSV no tiene el formato correcto');
              return;
            }
  
            // Convertir manualmente la columna 'id' a cadena para evitar la eliminación de ceros no significativos
            const convertedData = data.map((row) => ({
              id: String(row.id),
              nota: row.nota,
              tipoExamen: row.tipoExamen,
            }));
  
            setCsvData(convertedData);
          },
          error: (error) => {
            setError('Error al analizar el archivo CSV');
          },
        });
      };
  
      reader.readAsText(file);
    }
  };
  
  

  const sendCsvData = async () => {
    try {
      const response = await axios.post('http://localhost:8888/notas', { csvData });

      if (response.status === 200) {
        alert('Datos CSV enviados con éxito.');
        handleLimpiarTb();
      } else {
        alert('Error al enviar los datos CSV.');
        return;
      }
    } catch (error) {
      console.error('Error al realizar la petición:', error);
      alert('Error al enviar los datos CSV.');
      return;
    }
  };

  return (
    <div className=" py-8">
      <h2 className=' bg-gray-100 shadow-xl mr-64 ml-32 text-center py-1 text-opacity-80 mb-16 text-slate-700  font-label text-4xl font-bold'>Notas de examenes que el <span className='text-indigo-700'>estudiante</span> realizo</h2>
      <input
        type="file"
        id='Tabla'
        accept=".csv"
        onChange={(e) => {
          setError(null); // Limpiar el error
          handleFileUpload(e.target.files[0]);
        }}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg mb-4"
      />

      {error && (
        <div className="text-red-500 font-semibold mb-4">{error}</div>
      )}
      <div className='inline ml-36'>

      {/* <Link 
        className='text-gray-500 hover:underline font-label' to='/administracion' >            
        <button className=' bg-rose-600 duration-300 ml-8  ransition ease-in-out hover:translate-y-1 hover:scale-110  text-white py-2 px-5 rounded-lg hover:bg-rose-700 font-medium  uppercase font-label shadow-lg shadow-rose-400/80'>
            Regresar
        </button>
      </Link> */}

      <button onClick={sendCsvData} className="bg-rose-600 duration-300 ml-8  ransition ease-in-out hover:translate-y-1 hover:scale-110  text-white py-2 px-5 rounded-lg hover:bg-rose-700 font-medium  uppercase font-label shadow-lg shadow-rose-400/80">
            Enviar
          </button>
      </div>

{csvData.length > 0 && (
      <div className=' max-h-96 overflow-y-auto mr-96 mt-6'>
        <table className=" bg-white border shadow-lg border-separate w-full ">
          <thead>
            <tr>
              <th className="bg-blue-100 uppercase  border border-slate-300 text-left px-6 py-3 text-gray-600">ID</th>
              <th className="bg-blue-100 uppercase text-left border border-slate-300 px-6 py-3 text-gray-600">Nota</th>
              <th className="bg-blue-100 uppercase text-left border border-slate-300 px-6 py-3 text-gray-600">Tipo de Examen</th>
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="px-6 py-4 lowercase">{row.id}</td>
                <td className="px-6 py-4 lowercase">{row.nota}</td>
                <td className="px-6 py-4 lowercase">{row.tipoExamen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
export default SubirCsv;