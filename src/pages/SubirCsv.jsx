import React from 'react';
import { useState } from 'react';
import Papa from 'papaparse'; // Importa la biblioteca papaparse

function SubirCsv() {
  const [csvData, setCsvData] = useState([]); // Estado para almacenar los datos CSV
  const [error, setError] = useState(null);

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
          dynamicTyping: true,
          complete: (result) => {
            const data = result.data;
            
            // Verificar si los nombres de columna son correctos
            const expectedColumns = ['id', 'nota', 'tipoExamen'];
            const columns = Object.keys(data[0]);

            if (!expectedColumns.every((col) => columns.includes(col))) {
              setError('El archivo CSV no tiene el formato correcto');
              return;
            }

            setCsvData(data);
          },
          error: (error) => {
            setError('Error al analizar el archivo CSV');
          },
        });
      };

      reader.readAsText(file);
    }
  };

  return (
    <div className="py-10">
      <input
        type="file"
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

{csvData.length > 0 && (
        <table className="min-w-full bg-white border shadow-lg">
          <thead>
            <tr>
              <th className="bg-blue-100 text-left px-6 py-3 text-gray-600">ID</th>
              <th className="bg-blue-100 text-left px-6 py-3 text-gray-600">Nota</th>
              <th className="bg-blue-100 text-left px-6 py-3 text-gray-600">Tipo de Examen</th>
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="px-6 py-4">{row.id}</td>
                <td className="px-6 py-4">{row.nota}</td>
                <td className="px-6 py-4">{row.tipoExamen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default SubirCsv;