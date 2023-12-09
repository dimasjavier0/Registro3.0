/*import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NotasDocente() {
    const [clases, setClases] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [claseSeleccionada, setClaseSeleccionada] = useState(null);

    useEffect(() => {
        const obtenerClasesAsignadas = async () => {
            try {
                const idDocente = 123;
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
    const idDocente = "202020"/* Aquí obtienes el ID del docente */;

    useEffect(() => {
        const obtenerSecciones = async () => {
            try {
                const response = await axios.get(`http://localhost:8888/${idDocente}`);
                if(response.data.estado) {
                    setSecciones(response.data.periodos);
                } else {
                    alert('El proceso de ingreso de notas no está activo');
                }
            } catch (error) {
                console.error('Error al obtener secciones:', error);
            }
        };

        obtenerSecciones();
    }, [idDocente]);

    const manejarSeleccionSeccion = async (idSeccion) => {
        try {
            const response = await axios.get(`http://localhost:8888/secciones/${idSeccion}`);
            setEstudiantes(response.data);
            setSeccionSeleccionada(idSeccion);
        } catch (error) {
            console.error('Error al obtener estudiantes:', error);
        }
    };

    const enviarNotas = async () => {
        try {
            const datosParaEnviar = estudiantes.map(estudiante => ({
                numero_cuenta: estudiante['Numero de cuenta'],
                nota: estudiante.nota,
                observacion: estudiante.estado
            }));

            await axios.post(`http://localhost:8888/${seccionSeleccionada}`, datosParaEnviar);
            alert('Notas enviadas con éxito');
        } catch (error) {
            console.error('Error al enviar notas:', error);
            alert('Error al enviar notas');
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

            {seccionSeleccionada && (
                <>
                    <h2 className="text-2xl font-semibold mb-4">Estudiantes en la Sección</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {estudiantes.map((estudiante, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow">
                                <p className="font-medium">{estudiante['Nombre']}</p>
                                <input
                                    type="number"
                                    className="mt-2 w-full py-2 px-3 border border-gray-300 rounded-md"
                                    placeholder="Nota"
                                    value={estudiante.nota || ''}
                                    onChange={(e) => {
                                        const nuevaNota = e.target.value;
                                        setEstudiantes(estudiantesPrevios =>
                                            estudiantesPrevios.map(est =>
                                                est['Numero de cuenta'] === estudiante['Numero de cuenta']
                                                    ? { ...est, nota: nuevaNota }
                                                    : est
                                            )
                                        );
                                    }}
                                />
                                <select
                                    className="mt-2 w-full py-2 px-3 border border-gray-300 bg-white rounded-md"
                                    value={estudiante.estado || ''}
                                    onChange={(e) => {
                                        const nuevoEstado = e.target.value;
                                        setEstudiantes(estudiantesPrevios =>
                                            estudiantesPrevios.map(est =>
                                                est['Numero de cuenta'] === estudiante['Numero de cuenta']
                                                    ? { ...est, estado: nuevoEstado }
                                                    : est
                                            )
                                        );
                                    }}
                                >
                                    <option value="">Seleccione un estado</option>
                                    <option value="Aprobado">Aprobado</option>
                                    <option value="Reprobado">Reprobado</option>
                                    <option value="No se presentó">No se presentó</option>
                                    <option value="Abandono">Abandono</option>
                                </select>
                            </div>
                        ))}
                    </div>

                    <button
                        className="mt-6 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                        onClick={enviarNotas}
                    >
                        Enviar Notas
                    </button>
                </>
            )}
        </div>
    );
}

export default NotasDocente;
