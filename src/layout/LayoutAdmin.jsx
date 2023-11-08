import React from 'react'
import { Link } from 'react-router-dom'
function LayoutAdmin() {

    return (
        <div className='flex min-h-screen'>
            <aside className=' bg-indigo-700 px-14 py-10'>
                <h1 className='text-5xl 
                font-black text-center text-white mt-10'>Administrador
                </h1>
                <img className=' w-48 h-48 ml-32 mb-6' src="src/img/Seguridad.png" alt="" />
                <nav className=''>
                    <Link >
                        <button className='transition text-white ml-16 font-bold text-2xl ease-in-out  hover:scale-125 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-white border-2 pb-1'>
                            Matricula
                        </button>
                    </Link>

                    <Link >
                        <button className='transition block mt-10 ml-16 text-white font-bold text-2xl ease-in-out  hover:scale-125 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-white border-2 pb-1'>
                            Nuevo docente
                        </button>
                    </Link>

                    <Link >
                        <button className='transition block mt-10 ml-16 text-white font-bold text-2xl ease-in-out  hover:scale-125 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-white border-2 pb-1'>
                            Planificación académica
                        </button>
                    </Link>

                    <Link >
                        <button className='transition block mt-10 ml-16 text-white font-bold text-2xl ease-in-out  hover:scale-125 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-white border-2 pb-1'>
                            Cancelaciones excepcionales.
                        </button>
                    </Link>

                </nav>

            </aside>

            <main>
            
            </main>

            
        </div>
    )
}

export default LayoutAdmin