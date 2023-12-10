import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrearSecciones = () => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [numEmpleados, setNumEmpleados] = useState([]);
    const [aulas, setAulas] = useState([]); 
    const [selectedAsignatura, setSelectedAsignatura] = useState('');
    const [selectedNumEmpleado, setSelectedNumEmpleado] = useState('');
    const [selectedAula, setSelectedAula] = useState(''); 
    const [departamentoId, setDepartamentoId] = useState('');
    const [departamentoNombre, setDepartamentoNombre] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [dias, setDias] = useState('');
    const [cupos, setCupos] = useState('');

    useEffect(() => {
        const fetchData = async () => {
        try {
            const asignaturasResponse = await axios.get('http://localhost:8888/crearSecciones/asignaturas');
            const numEmpleadosResponse = await axios.get('http://localhost:8888/crearSecciones/docentes/num_empleados');
            const aulasResponse = await axios.get('http://localhost:8888/crearSecciones/aulas');

            setAsignaturas(asignaturasResponse.data);
            setNumEmpleados(numEmpleadosResponse.data);
            setAulas(aulasResponse.data);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
        };

        fetchData();
    }, []);

    const handleAsignaturaChange = async (asignaturaId) => {
        setSelectedAsignatura(asignaturaId);

        try {
        const response = await axios.get(`http://localhost:8888/crearSecciones/departamentos/${asignaturaId}`);
        const departamentoData = response.data[0];

        setDepartamentoId(departamentoData.id_dep_academico);
        setDepartamentoNombre(departamentoData.nombre);
        } catch (error) {
        console.error('Error al obtener información del departamento:', error);
        }
    };

    const handleNumEmpleadoChange = (numEmpleado) => {
        setSelectedNumEmpleado(numEmpleado);
    };

    const handleAulaChange = (aulaId) => {
        setSelectedAula(aulaId);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            await axios.post('http://localhost:8888/guardarSeccion', {
                asignaturaId: selectedAsignatura,
                numEmpleado: selectedNumEmpleado,
                aulaId: selectedAula,
                departamentoId: departamentoId,
                horaInicio: horaInicio,
                horaFin: horaFin,
                dias: dias,
                cupos: cupos
            });
    
            console.log('Sección creada con éxito');
        } catch (error) {
            console.error('Error al crear la sección:', error);
            
        }
    };;

return (
        <div className="max-w-md mt-10 ml-32 p-4 rounded border-2 shadow-lg">
        <h2 className="text-2xl mb-7 font-bold font-lato text-center ">Crear Seccion</h2>
        <form onSubmit={handleSubmit}>
            <select
            onChange={(e) => handleAsignaturaChange(e.target.value)}
            value={selectedAsignatura}
            className="border p-2 rounded w-full mb-4"
            >
            <option value="" disabled>Selecciona una asignatura</option>
            {asignaturas.map((asig) => (
                <option key={asig.id_asignatura} value={asig.id_asignatura}>
                {asig.nombre_asig}
                </option>
            ))}
            </select>

            <select
            onChange={(e) => handleNumEmpleadoChange(e.target.value)}
            value={selectedNumEmpleado}
            className="border p-2 rounded w-full mb-4"
            >
            <option value="" disabled>Selecciona un num_empleado</option>
            {numEmpleados.map((numEmpleado) => (
                <option key={numEmpleado} value={numEmpleado}>
                {numEmpleado}
                </option>
            ))}
            </select>

            <select
            onChange={(e) => handleAulaChange(e.target.value)}
            value={selectedAula}
            className="border p-2 rounded w-full mb-4"
            >
            <option value="" disabled>Selecciona un aula</option>
            {aulas.map((aula) => (
                <option key={aula.id_aula} value={aula.id_aula}>
                {aula.numero_aula}
                </option>
            ))}
            </select>

            <input
            className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
            type='text'   
            placeholder='hora Inicial'
            value={horaInicio}
            onChange={(e) => {
                setHoraInicio(e.target.value);
            }}
            />

            <input
            className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
            type='text'   
            placeholder='hora Final'
            value={horaFin}
            onChange={(e) => {
                setHoraFin(e.target.value);
            }}
            />

            <input
            className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
            type='text'   
            placeholder='Dias'
            value={dias}
            onChange={(e) => {
                setDias(e.target.value);
            }}
            />

            <input
            className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
            type='text'   
            placeholder='Cupos'
            value={cupos}
            onChange={(e) => {
                setCupos(e.target.value);
            }}
            />

            {selectedAsignatura && (
            <div>
                <h3 className="text-lg font-bold mb-2">Datos Seccion</h3>
                <p>
                <span>ID asignatura:</span> {selectedAsignatura}
                </p>
                <p>
                <span>Num Empleado:</span> {selectedNumEmpleado}
                </p>
                <p>
                <span>Aula ID:</span> {selectedAula}
                </p>
                <p>
                <span>Departamento ID:</span> {departamentoId}
                </p>
                <p>
                <span>Departamento:</span> {departamentoNombre}
                </p>
                <p>
                <span>Hora Inicial:</span> {horaInicio}
                </p>
                <p>
                <span>Hora Final:</span> {horaFin}
                </p>
                <p>
                <span>Hora dias:</span> {dias}
                </p>
                <p>
                <span>Hora cupos:</span> {cupos}
                </p>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
                Crear sección
                </button>
            </div>
            )}
        </form>
        </div>
);
};

export default CrearSecciones;
