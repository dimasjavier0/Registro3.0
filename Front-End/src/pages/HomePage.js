import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {

    return (
        <>
            <div className='flex justify-center mt-28'>
                <div className='bg-white p-8 rounded-xl border shadow-lg max-w-md w-full'>
                    <h2 className='mb-6 text-3xl text-center font-bold font-label'>Bienvenido al Chat UNAH</h2>

                    <nav className='flex flex-col items-center'>
                        <Link className='text-indigo-600 hover:text-indigo-700 font-medium mb-4 font-label' to='/chatEstudiantes'>Chat Estudiantes</Link>
                        <Link className='text-indigo-600 hover:text-indigo-700 font-medium mb-4 font-label' to='/solicitudContacto'>Solicitud de Contactos</Link>
                        <Link className='text-indigo-600 hover:text-indigo-700 font-medium mb-4 font-label' to='/crearGrupo'>Crear Grupo</Link>
                        <Link className='text-indigo-600 hover:text-indigo-700 font-medium mb-4 font-label' to='/verGrupos'>Ver Grupos</Link>
                        <Link className='text-indigo-600 hover:text-indigo-700 font-medium font-label' to='/compartirArchivos'>Compartir Archivos</Link>
                    </nav>
                </div>
            </div>

            <div className='mt-10 text-center'>
                <img src='/img/UNAH-Logo.png' alt="UNAH-Logo" className='inline-block' />
            </div>
        </>
    );
}

export default HomePage;