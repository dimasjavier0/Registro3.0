import React, { useState,useEffect } from 'react';
import AlertaError from '../components/AlertaError';
import axios from 'axios';

function CambioCentro() {
        const [motivo, setMotivo] = useState('');
        const [centros, setCentros] = useState([]);
        const [eleccionCentro, setEleccionCentro] = useState('');
        
        useEffect(() => {
            const obtenerCentros = async () => {
                try {
                    const response = await axios.get('http://localhost:8888/centros');
                    setCentros(response.data);
                } catch (error) {
                    console.error('Error al obtener la lista de centros:', error);
                }
            };
            obtenerCentros();
        }, []); 
    

        
return (
    <>
        
    <div className='grid grid-cols-3' >
        
        <div className='col-span-2'>
        <h1 className="text-4xl font-label font-bold mt-28  mb-4">Solicitud de cambio de centro</h1>
        
        <div>
            <form >

            <label className='block uppercase mb-2 mt-16 font-bold text-gray-700 text-base font-label'>Seleccione el centro al cual desea hacer el cambio:</label>
            <select
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label'
                    value={eleccionCentro}
                    onChange={(e) => {
                        setEleccionCentro(e.target.value);
                    }}
                >
                    <option value='' disabled>-- Seleccione --</option>
                    {centros.map((centro) => (
                        <option key={centro.id_centro} value={centro.nombre_centro}>
                            {centro.nombre_centro}
                        </option>
                    ))}
            </select>
                
                
                <label className='block uppercase mb-2 mt-10 font-bold text-gray-700 text-base font-label'>Motivo del cambio de centro:</label>
                <textarea
                className="w-full px-3 py-2 h-36 rounded-md focus:outline-none focus:ring-0 border-2 focus:border-yellow-600"
                placeholder="Razones por las cuales deseas realizar este cambio de carrera"
                value={motivo}
                onChange={(e) => {
                    setMotivo(e.target.value);
                }}
                />
                <button 
                        type='submit' 
                        className='bg-yellow-600 text-white py-2 px-4 mt-5 rounded-lg hover:bg-yellow-700 font-medium w-full uppercase mb-9 font-label shadow-lg shadow-yellow-100/70'>Enviar
                </button>
            </form>
        </div>
        </div>
    </div>

    </>
)}

export default CambioCentro



