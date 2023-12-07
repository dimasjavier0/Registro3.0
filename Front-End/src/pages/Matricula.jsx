import React, { useState, useEffect } from 'react';
import AlertaError from '../components/AlertaError';
import Asignatura from '../components/Asignatura';
import Departamento from '../components/Departamento';
import Seccion from '../components/Seccion';

function Matricula() {
    const [departamento, setDepartamento] = useState(null);
    const [asignatura, setAsignatura] = useState(null);
    const [seccion, setSeccion] = useState(null);

    useEffect(() => {
        

    }, [departamento, asignatura, seccion]);

    return (
        <>
        <div className='grid grid-cols-3 '>
            <div className='col-span-2'>
            <h1 className="text-4xl font-label font-bold mt-20 mb-4">Proceso de matrícula estudiante</h1>
            
            <div className='grid grid-cols-3 gap-4 mt-16 shadow-xl p-6 py-8 border rounded-md'>

                <div className='col-span-1'>
                    <h2 className=' bg-orange-700/80 text-center text-lg text-white font-bold rounded-sm p-1 font-label'>Departamentos</h2>
                    <div className=' h-52 overflow-y-scroll mt-5 border p-2'>
                    <Departamento 
                    onSelectDepartamento={setDepartamento} 
                    />
                    </div>
                </div>

                <div className='col-span-1'>
                    <h2 className='bg-orange-700/80 text-center text-lg text-white font-bold rounded-sm p-1 font-label'>Asignaturas</h2>
                    <div className=' h-52 overflow-y-scroll mt-5 border p-2'>
                    {departamento && (
                    <Asignatura
                    departamento={departamento}
                    onSelectAsignatura={setAsignatura}
                    />
                    )}
                    </div>
                </div>

                <div className='col-span-1'>
                    <h2 className='bg-orange-700/80 text-center text-lg text-white font-bold rounded-sm p-1 font-label'>Secciones</h2>
                    <div className=' h-52 overflow-y-scroll mt-5 border p-2'>
                    {asignatura && (
                    <Seccion asignatura={asignatura} 
                    onSelectSeccion={setSeccion} />
                    )}
                    </div>
                    
                </div>
                
                <button className='col-start-3 mt-14  hover:bg-orange-700  bg-orange-600 p-2 text-white  rounded-sm font-lato font-bold'>
                        Matricular asignatura
                </button>
                
            </div>
            
            
            </div>
        </div>
        </>
    );
}

export default Matricula;
