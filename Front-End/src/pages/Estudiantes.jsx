import React from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useState } from 'react';
import AlertaError from '../components/AlertaError';
import axios from 'axios';
import { useUserContext } from '../components/UserContext';


function Estudiantes() {

    const navigate = useNavigate();
    const { setUserContext } = useUserContext();
    
    const [alerta, setAlerta] = useState({});
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:8888/estudianteLog/logES', {
                nombre_usuario: usuario,
                password: contraseña,
            });
            const data = response.data;
            console.log('respuesta Recibida:',data);
            if (data.success) {
                localStorage.setItem("sesion",JSON.stringify(data.sesion));
                console.log('Inicio de sesión exitoso');
                setUserContext({ user_id: data.user_id });
                navigate('/principalEstudiante') 
                
            } else {
                console.log('Error en inicio de sesión:', data.message);
                setAlerta({ mensaje:  data.message,
                            error: true });
                return;
            }
        } catch (error) {
            console.error('Error de red:', error);
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

