import React, { useState } from 'react';

const clases = ['Ingenieria del software', 'Inteligencia Artificial'];

//Simulacion de datos para visualizacion 
const datosEstudiantes = {
'Ingenieria del software': [
{ id: 1, nombre: 'Carlos pavon', nota: '', estado: '' },
{ id: 2, nombre: 'Luiz suarez', nota: '', estado: '' },
],
'Inteligencia Artificial': [
{ id: 1, nombre: 'Choco Lozano', nota: '', estado: '' },
{ id: 2, nombre: 'Dani alvez', nota: '', estado: '' },
],
};

function NotasDocente() {
const [claseSeleccionada, setClaseSeleccionada] = useState(null);
const [estudiantes, setEstudiantes] = useState([]);

const manejarSeleccionClase = (nombreClase) => {
setClaseSeleccionada(nombreClase);
setEstudiantes(datosEstudiantes[nombreClase]);
};

const manejarEstablecerNota = (idEstudiante, nota) => {
setEstudiantes((estudiantesPrevios) =>
    estudiantesPrevios.map((estudiante) =>
    estudiante.id === idEstudiante ? { ...estudiante, nota } : estudiante
    )
);
};

const manejarEstablecerEstado = (idEstudiante, estado) => {
setEstudiantes((estudiantesPrevios) =>
    estudiantesPrevios.map((estudiante) =>
    estudiante.id === idEstudiante ? { ...estudiante, estado } : estudiante
    )
);
};

return (
    <>
    <h1 className='text-4xl shadow-md bg-gray-200 mr-44 p-2 text-indigo-700 font-label font-black mb-10 mt-24  font-lato'>Ingreso de notas docente</h1>
    <div className='grid border-2 grid-cols-4 gap-5 mt-16 mr-40 shadow-xl p-6 py-8 h-52 rounded-md overflow-y-scroll '>
    <div>
    <h2 className=' cursor-default bg-blue-800 mb-5 text-center text-lg text-white font-bold rounded-sm p-1 font-label'>Clases Asignadas</h2>
    <select
        className='mt-3 border-2 py-1 cursor-pointer'
        value={claseSeleccionada || ''}
        onChange={(e) => manejarSeleccionClase(e.target.value)}
    >
        <option value="" disabled>-- Seleccione --</option>
        {clases.map((nombreClase) => (
        <option key={nombreClase} value={nombreClase}>
            {nombreClase}
        </option>
        ))}
    </select>
    </div>

    {claseSeleccionada && (
    <div className=' cursor-default'>
        <h2 className='bg-blue-800 mb-5 text-center text-lg text-white font-bold rounded-sm p-1 font-label'>Estudiantes</h2>
        <ul>
        {estudiantes.map((estudiante) => (
            <li className='mt-3 ' key={estudiante.id}>
            {estudiante.nombre}
            </li>
        ))}
        </ul>
    </div>
    )}

    {claseSeleccionada && (
    <div>
        <h2 className='bg-blue-800 cursor-default mb-5 text-center text-lg text-white font-bold rounded-sm p-1 font-label'>Notas</h2>
        <ul>
        {estudiantes.map((estudiante) => (
            <li className='mt-3 border-2' key={estudiante.id}>
            <input
                type="text"
                placeholder="Nota"
                value={estudiante.nota}
                onChange={(e) => manejarEstablecerNota(estudiante.id, e.target.value)}
            />
            </li>
        ))}
        </ul>
    </div>
    )}

    {claseSeleccionada && (
    <div>
        <h2 className='bg-blue-800 cursor-default mb-5 text-center text-lg text-white font-bold rounded-sm p-1 font-label'>Estados</h2>
        <ul>
        {estudiantes.map((estudiante) => (
            <li className='mt-3 border-2' key={estudiante.id}>
            <select
                className='cursor-pointer'
                value={estudiante.estado}
                onChange={(e) => manejarEstablecerEstado(estudiante.id, e.target.value)}
            >
                <option value="" disabled>-- Seleccione --</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Reprobado">Reprobado</option>
                <option value="No se presentó">No se presentó</option>
                <option value="Abandono">Abandono</option>
            </select>
            </li>
        ))}
        </ul>
    </div>
    )}
</div>
</>
);
}

export default NotasDocente;
