import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlertaError from '../components/AlertaError';

const CrearSecciones = () => {
    const [alerta, setAlerta] = useState({});
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

    const handleKeyDown = (event) => {
        const key = event.key; 
        if (/[0-9]/.test(key)) {
            event.preventDefault();
        }
    };

    const handleSoloNumerosHI = (e) => {
        if (/^\d*$/.test(e.target.value)) {
        setHoraInicio(e.target.value);
        }
    };

    const handleSoloNumerosFN = (e) => {
        if (/^\d*$/.test(e.target.value)) {
        setHoraFin(e.target.value);
        }
    };

    const handleSoloNumerosCP = (e) => {
        if (/^\d*$/.test(e.target.value)) {
        setCupos(e.target.value);
        }
    };

    const LimpiarFormulario = () => {
        setSelectedAsignatura('');
        setSelectedNumEmpleado('');
        setSelectedAula('');
        setDepartamentoId('');
        setDepartamentoNombre('');
        setHoraInicio('');
        setHoraFin('');
        setDias('');
        setCupos('');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {

        if (!selectedAsignatura || !selectedNumEmpleado || !selectedAula || !horaInicio || !horaFin || !dias || !cupos) {
            setAlerta({mensaje: 'Por favor, complete todos los campos', 
            error: true})
            setTimeout(() => {
                setAlerta({});
            }, 2000);
            return;
        }

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
            setAlerta({mensaje: '¡Sección creada con exito!', 
            error: false})
            setTimeout(() => {
                setAlerta({});
            }, 2000);
            LimpiarFormulario();
        } catch (error) {
            console.error('Error al crear la sección:', error);
            
        }
    };;
        const {mensaje}= alerta
return (
        <div className="max-w-md mt-10 px-5 ml-32 p-4 rounded-md border-2 shadow-lg">
        <h2 className="text-4xl mb-7 font-label font-semibold text-center ">Crear sección</h2>
        
        {mensaje && <AlertaError 
                    alerta={alerta}
                />}

        <form onSubmit={handleSubmit}>
            <select
            onChange={(e) => handleAsignaturaChange(e.target.value)}
            value={selectedAsignatura}
            className="border-2 p-2 w-full mb-4 rounded-md"
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
            className="border-2 p-2 rounded-md w-full mb-4"
            >
            <option value="" disabled>Selecciona un docente</option>
            {numEmpleados.map((numEmpleado) => (
                <option key={numEmpleado} value={numEmpleado}>
                {numEmpleado}
                </option>
            ))}
            </select>

            <select
            onChange={(e) => handleAulaChange(e.target.value)}
            value={selectedAula}
            className="border-2 p-2 rounded-md w-full mb-4"
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
            onChange={handleSoloNumerosHI}
            />

            <input
            className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
            type='text'   
            placeholder='hora Final'
            value={horaFin}
            onChange={handleSoloNumerosFN}
            />

            <input
            className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
            type='text'   
            placeholder='Días de la semana'
            value={dias}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
                setDias(e.target.value);
            }}
            />

            <input
            className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
            type='text'   
            placeholder='Cupos'
            value={cupos}
            onChange={handleSoloNumerosCP}
            />
            <button type="submit" className='bg-indigo-600 w-full  mr-10 text-white py-2 px-8 rounded-lg hover:bg-indigo-700 font-medium  uppercase mb-2 font-label shadow-lg shadow-indigo-400/100'>
                Crear sección
            </button>

            {/* {selectedAsignatura && (
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
            )} */}
        </form>
        </div>
);
};

export default CrearSecciones;
