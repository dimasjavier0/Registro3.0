import React from 'react'
import { Link } from 'react-router-dom'
function HeaderAdministrador() {

    return (
        <div className='flex min-h-screen'>
            <aside className=' bg-indigo-700 '>
                    <div className=' mt-5'>
                    <Link
                    to='/' 
                    className=" ml-72 ">
                    <i className="text-white fa-regular fa-share-from-square fa-rotate-180 fa-2xl"></i>
                    </Link>
                    </div>
                <div className=' mr-16'>
                <h1 className='text-4xl ml-8 
                font-black text-center text-white mt-10'>Administrador
                </h1>
                <img className=' w-44 h-40 ml-20 mb-8' src="/img/Seguridad.png" alt="Seguridad" />
                <nav className=''>
                <Link to="/administracion/activarmatricula">
       <button className='transition text-white ml-8 font-bold text-lg ease-in-out  hover:scale-110 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-white border-2 pb-1'>
         Matricula
           </button>
                     </Link>

                    <Link to='/administracion/SubirCsv'>
                        <button className='transition block mt-10 ml-8 text-white font-bold text-lg ease-in-out  hover:scale-110 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-white border-2 pb-1'>
                            Ingresar Notas
                        </button>
                    </Link>

                    <Link to='/administracion/nuevoDocente'>
                        <button className='transition block mt-10 ml-8 text-white font-bold text-lg ease-in-out  hover:scale-110 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-white border-2 pb-1'>
                            Nuevo docente
                        </button>
                    </Link>

                    <Link to='/administracion/estAdmitidos'>
                        <button className='transition block mt-10 ml-8 text-white font-bold text-lg ease-in-out  hover:scale-110 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-white border-2 pb-1'>
                            Estudiantes admitidos
                        </button>
                    </Link>

                    <Link >
                        <button className='transition block mt-10 ml-8 text-white font-bold text-lg ease-in-out  hover:scale-110 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-white border-2 pb-1'>
                            Planificación académica
                        </button>
                    </Link>

                    <Link >
                        <button className='transition block mt-10 ml-8 mb-16 text-white font-bold text-lg ease-in-out  hover:scale-110 shadow-md hover:shadow-white rounded-lg py-0 px-2 border-white border-2 pb-1'>
                            Cancelaciones excepcionales.
                        </button>
                    </Link>

                </nav>
                </div>
            </aside>
        </div>
        
    )
}

export default HeaderAdministrador