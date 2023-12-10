/*import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NotasDocente() {
    const [clases, setClases] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [claseSeleccionada, setClaseSeleccionada] = useState(null);

    useEffect(() => {
        const obtenerClasesAsignadas = async () => {
            try {
                const idDocente = 202020;
                const response = await axios.get(`http://localhost:8888/api/ruta/${idDocente}`);
                setClases(response.data.clases); // Asumiendo que la respuesta tiene un campo 'clases'
            } catch (error) {
                console.error('Error al obtener clases:', error);
            }
        };

        obtenerClasesAsignadas();
    }, []);

    const manejarSeleccionClase = async (idSeccion) => {
        try {
            const response = await axios.get(`http://localhost:8888/api/secciones/${idSeccion}`);
            setEstudiantes(response.data); // Asumiendo que la respuesta es la lista de estudiantes
            setClaseSeleccionada(idSeccion);
        } catch (error) {
            console.error('Error al obtener estudiantes:', error);
        }
    };

    const enviarNotas = async () => {
        try {
            const datosParaEnviar = estudiantes.map(estudiante => ({
                numero_cuenta: estudiante.id, // Asegúrate de que esto coincida con la estructura de datos esperada por tu backend
                nota: estudiante.nota,
                observacion: estudiante.estado
            }));
    
            await axios.post(`http://localhost:8888/api/${claseSeleccionada}`, datosParaEnviar);
            alert('Notas enviadas con éxito');
        } catch (error) {
            console.error('Error al enviar notas:', error);
            alert('Error al enviar notas');
        }
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

*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NotasDocente() {
    const [secciones, setSecciones] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);
    const idDocente = 202020; // Aquí obtienes el ID del docente

    useEffect(() => {
        obtenerSecciones(idDocente);
    }, [idDocente]);

    const obtenerSecciones = async (idDocente) => {
        try {
            const response = await axios.get(`http://localhost:8888/api/estudiantesNotes/${idDocente}`);
            if (response.data.estado) {
                setSecciones(response.data.periodos);
            } else {
                alert('El proceso de ingreso de notas no está activo');
            }
        } catch (error) {
            console.error('Error al obtener secciones:', error);
        }
    };

    const manejarSeleccionSeccion = async (idSeccion) => {
        setSeccionSeleccionada(idSeccion);
        obtenerEstudiantes(idSeccion);
    };

    const obtenerEstudiantes = async (idSeccion) => {
        try {
            const response = await axios.get(`http://localhost:8888/api/estudiantesNotes/secciones/${idSeccion}`);
            setEstudiantes(response.data);
        } catch (error) {
            console.error('Error al obtener estudiantes:', error);
        }
    };

    const enviarNotas = async (estudiante, nota, observacion) => {
        try {
            await axios.post(`http://localhost:8888/api/estudiantesNotes/${seccionSeleccionada}`, {
                numero_cuenta: estudiante['Numero de cuenta'],
                nota: nota,
                observacion: observacion
            });
            alert('Nota enviada con éxito');
        } catch (error) {
            console.error('Error al enviar nota:', error);
            alert('Error al enviar nota');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-center mb-6">Ingreso de Notas</h1>

            <div className="mb-4">
                <label htmlFor="seccion" className="block text-lg font-medium text-gray-700">Sección:</label>
                <select
                    id="seccion"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={seccionSeleccionada || ''}
                    onChange={(e) => manejarSeleccionSeccion(e.target.value)}
                >
                    <option value="">Seleccione una sección</option>
                    {secciones.map((seccion, index) => (
                        <option key={index} value={seccion.id_seccion}>{seccion.hora_inicio} - {seccion.nombre_asig}</option>
                    ))}
                </select>
            </div>

            {seccionSeleccionada && estudiantes.map((estudiante, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                    <p className="font-medium">{estudiante['Nombre']}</p>
                    <input
                        type="number"
                        className="mt-2 w-full py-2 px-3 border border-gray-300 rounded-md"
                        placeholder="Nota"
                        onChange={(e) => enviarNotas(estudiante, e.target.value, 'Aprobado')} // Ejemplo de envío de nota
                    />
                </div>
            ))}
        </div>
    );
}

export default NotasDocente;
