import React, { useState,useEffect } from 'react';
import AlertaError from '../components/AlertaError';
import axios from 'axios';

function PagoReposicion() {
    const [motivo, setMotivo] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Construye el cuerpo de la petición
            const data = {
                motivo: motivo // Aquí incluyes los datos que necesitas enviar
            };

            // Realiza la petición POST
            const response = await axios.post(`http://localhost:8888/solicitudes/reposicion/${
                JSON.parse(localStorage.getItem('sesion'))["numeroCuenta"]
            }`, data);

            // Maneja la respuesta
            console.log(response.data);
            
            // Aquí puedes agregar lógica adicional para manejar la respuesta
            if(response.data){
                alert("Solicitud Enviada");
            }

        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            // Maneja el error aquí
        }
    };


return (
    <>
        
    <div className='grid grid-cols-3' >
        
        <div className='col-span-2'>
        <h1 className="text-4xl font-label font-bold mt-28  mb-4">Solicitud de pago de reposición</h1>
        
        <div>
            <form onSubmit={handleSubmit}>
                
                <label className='block uppercase mb-2 mt-14 font-bold text-gray-700 text-base font-label'>Escriba una justificación:</label>
                <textarea
                className="w-full px-3 py-2 h-36 rounded-md focus:outline-none focus:ring-0 border-2 focus:border-yellow-600"
                placeholder="Razones por las cuales realiza esta solicitud"
                value={motivo}
                onChange={(e) => {
                    setMotivo(e.target.value);
                }}
                />
                <div className='border-2 border-yellow-700 p-3 rounded-md mt-3 py-3  bg-gray-300'>
                    <p className=' text-red-800'>Recuerda: Al activar el pago de examen de reposición por medio de la plataforma
                    UNAH, podrás realizar dicho pago ÚNICAMENTE en Banco ATLÁNTIDA,
                    FICOHSA, DAVIVIENDA, BANPAIS, y Agencias LAFISE fuera de Ciudad Universitaria.</p>
                </div>
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

export default PagoReposicion



