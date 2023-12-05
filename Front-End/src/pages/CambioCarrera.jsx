import React, { useState,useEffect } from 'react';
import AlertaError from '../components/AlertaError';
import { useUserContext } from '../components/UserContext';
import axios from 'axios';

function PerfilEstudiante() {
        const [motivo, setMotivo] = useState('');
        const [eleccionCarrera, setEleccionCarrera] = useState('');
        const [carreras, setCarreras] = useState([]);
        const { user, numeroCuenta } = useUserContext();

        useEffect(() => {
            /**  Función para obtener las carreras*/
            const obtenerCarreras = async () => {
                try {

                    const response = await axios.get('http://localhost:8888/carreras');
                    console.warn(response);
                    const resultado = response.data;
                    console.log(`respuesta del backend: ${JSON.stringify(resultado)}`);
            
                    if (resultado && resultado.result) {
                        setCarreras(resultado.result);
                    }
            
                } catch (error) {
                    // En caso de error, 'resultado' no estará definido
                    console.error('Error al obtener carreras:', error);
                }
            };

            obtenerCarreras();
        }, []);

return (
    <>
        
    <div className='grid grid-cols-3' >
        
        <div className='col-span-2'>
        <h1 className="text-4xl font-label font-bold mt-28  mb-4">Solicitud de cambio de carrera</h1>
        
        <div>
            <form>

            <label className='block uppercase mb-2 mt-16 font-bold text-gray-700 text-base font-label'>Seleccione la carrera a la cual desea hacer el cambio:</label>
                <select
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label'
                    value={eleccionCarrera}
                    onChange={(e) => {
                        setEleccionCarrera(e.target.value);
                    }}
                >
                    <option value='' disabled>-- Seleccione --</option>
                    {carreras.map((carrera) => (
                        <option key={carrera.id_carrera} value={carrera.id_carrera}>
                            {carrera.nombre_carrera}
                        </option>
                    ))}
                </select> 
                
                <label className='block uppercase mb-2 mt-10 font-bold text-gray-700 text-base font-label'>Motivo del cambio de carrera:</label>
                <textarea
                className="w-full px-3 py-2 h-36 rounded-md focus:outline-none focus:ring-0 border-2 focus:border-yellow-600"
                placeholder="Razones por las cuales deseas realizar este cambio de centro"
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

export default PerfilEstudiante



