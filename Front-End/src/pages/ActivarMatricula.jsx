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
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-center mb-6">Activar Matrícula</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded shadow">
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