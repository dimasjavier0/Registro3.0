    import React, { useState, useEffect } from 'react';
    import axios from 'axios';

const CrearSecciones = () => {
    const [asignaturas, setAsignaturas] = useState([]);
    const [selectedAsignatura, setSelectedAsignatura] = useState('');
    const [departamentoId, setDepartamentoId] = useState('');
    const [departamentoNombre, setDepartamentoNombre] = useState('Cargando...');

    useEffect(() => {
        const fetchAsignaturas = async () => {
        try {
            const response = await axios.get('http://localhost:8888/crearSecciones/asignaturas');
            setAsignaturas(response.data);
        } catch (error) {
            console.error('Error al obtener asignaturas:', error);
        }
        };

        fetchAsignaturas();
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

    //enviar al backend
    const crearSeccion = async () => {
        try {
        await axios.post('http://localhost:8888/', {
            asignaturaId: selectedAsignatura,
            departamentoId: departamentoId,
        });

        console.log('Sección creada con éxito');
        } catch (error) {
        console.error('Error al crear la sección:', error);
        }
    };

    return (
        <div className="max-w-md mt-32 ml-32 p-4 rounded border-2 shadow-lg">
        <h2 className="text-2xl mb-7 font-bold font-lato text-center ">Seleccionar Asignatura</h2>
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

        {selectedAsignatura && (
            <div>
            <h3 className="text-lg font-bold mb-2">Asignatura Seleccionada</h3>
            <p>
                <span>ID asignatura:</span> {selectedAsignatura}
            </p>
            <p>
                <span>Departamento ID:</span> {departamentoId}
            </p>
            <p>
                <span>Departamento:</span> {departamentoNombre}
            </p>
            <button onClick={crearSeccion} className="bg-blue-500 text-white p-2 rounded mt-4">
                Crear sección
            </button>
            </div>
        )}
        </div>
    );
    };

export default CrearSecciones;
