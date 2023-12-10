import React, { useState } from 'react';
import axios from 'axios';

const ActivarMatricula = () => {
    const [idPAC, setIdPAC] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8888/activar-matricula', );
            console.log(response.data);
            // Manejar la respuesta o mostrar un mensaje de éxito
        } catch (error) {
            console.error('Error al activar la matrícula', error);
            // Manejar el error o mostrar un mensaje
        }
    };

    return (
        <div className=" p-4 mr-64 mt-32">
            <h2 className=' bg-gray-100 ml-20 mr-20 shadow-xl  text-center py-2 text-opacity-80 mb-16 text-slate-700  font-label text-4xl font-bold'>Activar <span className='text-indigo-700'>matrícula</span></h2>
            {/* <h1 className="text-4xl font-bold text-center mb-6">Activar Matrícula</h1> */}
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded border shadow-md">
                <div className="mb-4">
                    <label htmlFor="idPAC" className="block text-lg font-medium text-gray-700">ID PAC:</label>
                    <input
                        type="text"
                        id="idPAC"
                        value={idPAC}
                        onChange={(e) => setIdPAC(e.target.value)}
                        placeholder="ID PAC"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
    
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                >
                    Activar Matrícula
                </button>
            </form>
        </div>
    );
};

export default ActivarMatricula;