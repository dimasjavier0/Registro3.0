import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlertaError from '../components/AlertaError';

const CancelarSeccion = () => {
    const [alerta, setAlerta] = useState({});
    const [selectClaseCancelar, setSelectClaseCancelar] = useState('');
    const [motivoCancelacion, setMotivoCancelacion] = useState('');

    // useEffect(() => {
    //     const fetchData = async () => {
    //     try {
    //         const asignaturasResponse = await axios.get('http://localhost:8888/crearSecciones/asignaturas');
    //         setAsignaturas(asignaturasResponse.data);
    //     } catch (error) {
    //         console.error('Error al obtener datos:', error);
    //     }
    //     };
    //     fetchData();
    // }, []);



    const LimpiarFormulario = () => {
        setSelectClaseCancelar('');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
    //     try {

            if (!selectClaseCancelar || !motivoCancelacion) {
                setAlerta({mensaje: 'Por favor, complete todos los campos', 
                error: true})
                setTimeout(() => {
                    setAlerta({});
                }, 2000);
                return;
            }

    //         await axios.post('http://localhost:8888/guardarSeccion', {
    //             asignaturaId: selectedAsignatura,
    //             numEmpleado: selectedNumEmpleado,
    //             aulaId: selectedAula,
    //             departamentoId: departamentoId,
    //             horaInicio: horaInicio,
    //             horaFin: horaFin,
    //             dias: dias,
    //             cupos: cupos
    //         });
    
    //         console.log('Sección creada con éxito');
    //         setAlerta({mensaje: '¡Sección creada con exito!', 
    //         error: false})
    //         setTimeout(() => {
    //             setAlerta({});
    //         }, 2000);
    //         LimpiarFormulario();
    //     } catch (error) {
    //         console.error('Error al crear la sección:', error);
            
    //     }
    };;
        const {mensaje}= alerta
return (
        <div className="max-w-md mt-32 px-5 ml-32 p-4 rounded-md border-2 shadow-lg">
        <h2 className="text-4xl mb-7 font-label font-semibold text-center ">Cancelar sección</h2>
        
        {mensaje && <AlertaError 
                    alerta={alerta}
                />}

        <form onSubmit={handleSubmit}>
            <select
            className='border-2 p-2 rounded-md w-full mb-6'
            value={selectClaseCancelar}
                    onChange={(e) => {
                        setSelectClaseCancelar(e.target.value)
            }
            }
            >
                
            <option value="" disabled>Selecciona una asignatura</option>
            <option value="1" >Seccion1 </option>
            <option value="2" >Seccion2 </option>
            <option value="3" >Seccion3 </option>
            </select>

            <label className='block uppercase mb-3 font-bold text-gray-700 text-base font-label'>motivo de cancelacion:</label>
            <textarea
            className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
            type='text'   
            placeholder='Motivo de cancelacion'
            onChange={(e) => {
                setMotivoCancelacion(e.target.value)
            }}
            
            />

            <button type="submit" className='bg-indigo-600 w-full  mr-10 text-white py-2 px-8 rounded-lg hover:bg-indigo-700 font-medium  uppercase mb-2 font-label shadow-lg shadow-indigo-400/100'>
                Cancelar sección
            </button>
        </form>
        </div>
);
};

export default CancelarSeccion;
