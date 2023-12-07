import React from 'react'
import { Link } from 'react-router-dom'

function HeaderMatricula() {

return (
    <div className='h-full flex fixed'>
        <aside className=' bg-yellow-400'>
                <div className=' mt-5 px-6'>
                <Link
                to='/principalEstudiante' 
                className=" ml-64 mt-5 ">
                <i className="text-white fa-regular fa-share-from-square fa-rotate-180 fa-2xl"></i>
                </Link>
                </div>
                <div className=' mr-16'>
                <div>
                <h1 className='text-4xl ml-8 
                font-black text-center text-white mt-10'>Matricula <br />
                <p>estudiante</p>
                </h1>
                <img className=' w-44 h-40 ml-20 mb-8 mt-7' src="/img/vista-estudiante.png" alt="Seguridad" /> 
                
                <nav>
                <Link to='/principalMatricula/matricula'>
                    <button className='transition bg-gray-100 text-orange-900 mt-7 ml-8 font-bold text-lg ease-in-out  hover:scale-110 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-gray-500 border-2 pb-1'>
                        Adicionar asignatura
                    </button>
                </Link>

                <Link to='#'>
                    <button className='transition bg-gray-100 block mt-10 ml-8 text-orange-900 font-bold text-lg ease-in-out  hover:scale-110 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-gray-500 border-2 pb-1'>
                        Cancelar asignatura 
                    </button>
                </Link>

                
            </nav>
            
            </div>
            </div>
        </aside>
    </div>
        
    )
}

export default HeaderMatricula