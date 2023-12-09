import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

function EstAdmitidosCsv() {
    const [csvData, setCsvData] = useState([]);
    const [error, setError] = useState(null);

    const handleFileUpload = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvText = event.target.result;
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    dynamicTyping: false,
                    complete: (result) => {
                        const data = result.data;
                        const expectedColumns = ['nombre_completo', 'identidad', 'carrera_principal', 'correo_personal', 'id_centro'];
                        const columns = Object.keys(data[0]);

                        if (!expectedColumns.every(col => columns.includes(col))) {
                            setError('El archivo CSV no tiene el formato correcto');
                            return;
                        }
                        //console.log('data:',data);
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

    const handleLimpiarTb = () => {
        setError(null);
        document.getElementById('Tabla').value = ([]);
        setCsvData([]);
    };

    /**funcion para obtener el cuerpo de la peticion. */
    const getJsontoSend = (data)=>{
        
        let jsonToSend = {"estudiantes":[]};

        for(let estudiante of data.csvData){
            jsonToSend.estudiantes.push(
                [estudiante.identidad, estudiante.carrera_principal]
            );
        };

        return jsonToSend;
    };

    const sendCsvData = async () => {
        try {
            
            const response = await axios.post('http://localhost:8888/estudiantes',  getJsontoSend({csvData}) );

            if (response.status === 200) {
                console.log('respuesta:',response.data);
                alert('Datos CSV enviados con éxito.');
                handleLimpiarTb();
            } else {
                alert('Error al enviar los datos CSV.');
            }
        } catch (error) {
            console.error('Error al realizar la petición:', error);
            alert('Error al enviar los datos CSV.');
        }
    };
    return (
        <div className="mt-8 py-8">
            <h2 className=' bg-gray-100 shadow-xl mr-64 ml-32 text-center py-1 text-opacity-80 mb-16 text-slate-700  font-label text-4xl font-bold'>Listado de <span className='text-indigo-700'>estudiantes</span> admitidos</h2>
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

        <button onClick={sendCsvData} className="bg-rose-600 duration-300 ml-8  ransition ease-in-out hover:translate-y-1 hover:scale-110  text-white py-2 px-5 rounded-lg hover:bg-rose-700 font-medium  uppercase font-label shadow-lg shadow-rose-400/80">
            Enviar
        </button>

        {/* <Link 
            className='text-gray-500 hover:underline font-label' to='/administracion' >            
            <button className=' bg-rose-600 duration-300 ml-8  ransition ease-in-out hover:translate-y-1 hover:scale-110  text-white py-2 px-5 rounded-lg hover:bg-rose-700 font-medium  uppercase font-label shadow-lg shadow-rose-400/80'>
                Regresar
            </button>
        </Link> */}

        </div>

        {csvData.length > 0 && (
                <div className='max-h-96 overflow-scroll mr-36 mt-6'>
                    <table className="bg-white border shadow-lg w-9/12 border-separate">
                        <thead>
                            <tr className='text-sm'>
                                <th className="bg-blue-100 border uppercase border-slate-300 text-left px-6 py-3 text-gray-600">Nombre Completo</th>
                                <th className="bg-blue-100 text-center uppercase border border-slate-300 px-6 py-3 text-gray-600">Identidad</th>
                                <th className="bg-blue-100 text-center uppercase border border-slate-300 px-6 py-3 text-gray-600">Carrera Principal</th>
                                <th className="bg-blue-100 text-center uppercase border border-slate-300 px-6 py-3 text-gray-600">Correo Personal</th>
                                <th className="bg-blue-100 text-center uppercase border border-slate-300 px-6 py-3 text-gray-600">ID Centro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.map((row, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                    <td className="px-6 py-4 lowercase">{row.nombre_completo}</td>
                                    <td className="px-6 py-4 lowercase">{row.identidad}</td>
                                    <td className="px-6 py-4 lowercase">{row.carrera_principal}</td>
                                    <td className="px-6 py-4 lowercase">{row.correo_personal}</td>
                                    <td className="px-6 py-4 lowercase">{row.id_centro}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        
        </div>
    );
}

export default EstAdmitidosCsv
