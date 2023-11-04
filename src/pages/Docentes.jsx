import React from 'react'
import { Link } from 'react-router-dom'
function Docentes() {
    

    return (
        <>
            <div className='flex justify-center mt-28' >
                <div className='bg-white p-8 rounded-xl border shadow-lg max-w-md w-full'>
                    <h2 className='mb-6 text-3xl text-center font-bold font-label'>Iniciar Sesión <br /><span>Docentes</span></h2>
                    <form >
                        <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >N° Cuenta</label>
                        <input
                        className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                        type='email'   
                        placeholder='Numero De Cuenta'/>

                        <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label'>Clave</label>
                        <input
                        className='w-full p-2 border border-gray-300 rounded-md mb-7 bg-gray-100 font-label'
                        type='password'   
                        placeholder='Tu Contraseña'/>
                        <button 
                        type='submit' 
                        className='bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 font-medium w-full uppercase mb-9 font-label transition ease-in-out delay-50 hover:translate-y-1 hover:scale-90  duration-250'>Iniciar Sesión</button>
                        
                    </form>
                    <nav>
                        <Link className='text-gray-500 hover:underline font-label' to='/olvideContraseña'>¿Olvidaste tu contraseña? </Link>
                    </nav>
                </div>
            </div>
        <div className='imagenn'>
        <img src='/src/img/UNAH-DOCENTES.png' alt="" />
            </div>   
        </>
    )
}

export default Docentes

