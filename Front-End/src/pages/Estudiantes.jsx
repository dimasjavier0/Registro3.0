import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useState } from 'react';
import AlertaError from '../components/AlertaError';


function Estudiantes() {

    const navigate = useNavigate();
    
    const [alerta, setAlerta] = useState({});
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');


    function handleSubmit(e) {
        e.preventDefault();
        
        if ([usuario,contraseña].includes('')) {
            setAlerta({mensaje: 'Existen campos vacios', error: true})
            return;
        }
        if (usuario === '20232023111' && contraseña === 'admin') {
            navigate('/principalEstudiante') 
        } else {
            setAlerta({mensaje: 'Credenciales invalidas', 
            error: true})
            return;
        }
    };
    const {mensaje}= alerta

    return (
        <>
            <div className='flex justify-center mt-28' >
                <div className='bg-white p-8 rounded-xl border shadow-lg max-w-md w-full'>
                    <h2 className='mb-6 text-3xl text-center font-bold font-label'>Iniciar Sesión <br /><span>Estudiante</span></h2>
                    
                    {mensaje && <AlertaError 
                    alerta={alerta}
                    />}

                    <form onSubmit={handleSubmit} >
                        <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >N° Cuenta</label>
                        <input
                        className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                        type='text'   
                        placeholder='ej: 20235000400'
                        value={usuario}
                        onChange={(e) => {
                            setUsuario(e.target.value)
                        }
                        }
                        />

                        <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label'>Clave</label>
                        <input
                        className='w-full p-2 border border-gray-300 rounded-md mb-7 bg-gray-100 font-label'
                        type='password'   
                        placeholder='Tu Contraseña'
                        value={contraseña}
                        onChange={(e) => {
                            setContraseña(e.target.value)
                        }
                        }
                        />

                        <button 
                        type='submit' 
                        className='bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 font-medium w-full uppercase mb-9 font-label transition ease-in-out delay-50 hover:translate-y-1 hover:scale-90  duration-250'>Iniciar Sesión</button>
    
                    </form>

                    <nav>
                        <Link className='text-gray-500 hover:underline font-label' to='/olvideContraseña'>¿Olvidaste tu contraseña? </Link>
                    </nav>
                </div>
            </div>  
            <div className=''>
            <img src='/img/UNAH-ESTUDIANTES.png' alt="UNAH-ESTUDIANTES" />
            </div>    
        </>
    )
}

export default Estudiantes

