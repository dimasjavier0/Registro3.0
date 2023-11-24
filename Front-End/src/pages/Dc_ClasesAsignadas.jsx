import React from 'react'
import { useState } from 'react';

function Dc_ClasesAsignadas() {

    const [datos, setDatos] = useState([]);
    const [idClase, setIdClase] = useState('');

    return (
        <>  
            <div className=''>
            <h1 className='text-4xl text-red-800 font-black mb-4 mt-28 text-center font-lato'>Clases Asignadas</h1>
            <input
            className='border-2  border-rose-800 mb-20 ml-9 p-4'
            type="text"
            placeholder="Ingrese ID de Clase"
            value={idClase}
            onChange={(e) => 
                setIdClase(e.target.value)}
            />
            <button
            className='bg-blue-500 ml-20 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-4'
            //onClick evento para descargar listado
            > Descargar Listado
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
                {datos.map(dato => (
                    <tr key={dato.id}>
                    <td className='px-6 py-4 '>{dato.id}</td>
                    <td className='px-6 py-4 '>{dato.clase}</td>
                    <td className='px-6 py-4 '>{dato.seccion}</td>
                    <td className='px-6 py-4 '>{dato.hora}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </>
    )
    }

export default Dc_ClasesAsignadas
