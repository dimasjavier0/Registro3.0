/*import React from 'react'
import { Link } from 'react-router-dom'
function Docentes() {
    
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [passwordUser, setPasswordUser] = useState('');
    const [rol, setRol] = useState('');
    const [mensaje, setMensaje] = useState('');

    const navigate = useNavigate();
    const Docente = 'docente';

   
    return (
        <>
            <div className='flex justify-center mt-28' >
                <div className='bg-white p-8 rounded-xl border shadow-lg max-w-md w-full'>
                    <h2 className='mb-6 text-3xl text-center font-bold font-label'>Iniciar Sesión <br /><span>Docente</span></h2>
                    <form onSubmit={handleLogin} >
                        <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >N° Cuenta</label>
                        <input
                        className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label'   
                        placeholder='ej: 202350'
                        type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)}
                        
                        />

                        <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label'>Clave</label>
                        <input
                        className='w-full p-2 border border-gray-300 rounded-md mb-7 bg-gray-100 font-label'
                        type='password'   
                        placeholder='Tu Contraseña'
                        value={passwordUser} onChange={(e) => setPasswordUser(e.target.value)}
                        />
                        <button 
                        type='submit' 
                        className='bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 font-medium w-full uppercase mb-9 font-label transition ease-in-out delay-50 hover:translate-y-1 hover:scale-90  duration-250'>Iniciar Sesión</button>
                        
                    </form>
                    {mensaje && <p>{mensaje}</p>}
                    <nav>
                        <Link className='text-gray-500 hover:underline font-label' to='/olvideContraseña'>¿Olvidaste tu contraseña? </Link>
                    </nav>
                </div>
            </div>
        <div className='imagenn'>
        <img src='/img/UNAH-DOCENTES.png' alt="UNAH-DOCENTES" />
            </div>   
        </>
    )
}

export default Docentes

*/
/*
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Docentes() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [passwordUser, setPasswordUser] = useState('');
  const [mensaje, setMensaje] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8888/login', {
        nombreUsuario,
        passwordUser,
        rol: 'docente', // Establecer el rol directamente aquí
      });

      if (response.status === 200) {
        setMensaje(response.data.mensaje);
        navigate('/registrar');
      } else {
        setMensaje('Error en la autenticación');
      }
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      setMensaje('Error en la autenticación');
    }
  };

  return (
    <>
      <div className='flex justify-center mt-28'>
        <div className='bg-white p-8 rounded-xl border shadow-lg max-w-md w-full'>
          <h2 className='mb-6 text-3xl text-center font-bold font-label'>Iniciar Sesión <br /><span>Docente</span></h2>
          <form onSubmit={handleLogin}>
            <label className='block uppercase mb-2 font-bold text-gray-700 text-base font-label' >N° Cuenta</label>
            <input
              className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label'
              placeholder='ej: 202350'
              type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)}
            />

            <label className='block uppercase mb-2 font-bold text-gray-700 text-base font-label'>Clave</label>
            <input
              className='w-full p-2 border border-gray-300 rounded-md mb-7 bg-gray-100 font-label'
              type='password'
              placeholder='Tu Contraseña'
              value={passwordUser} onChange={(e) => setPasswordUser(e.target.value)}
            />
            <button
              type='submit'
              className='bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 font-medium w-full uppercase mb-9 font-label transition ease-in-out delay-50 hover:translate-y-1 hover:scale-90  duration-250'>Iniciar Sesión</button>

          </form>
          {mensaje && <p>{mensaje}</p>}
          <nav>
            <Link className='text-gray-500 hover:underline font-label' to='/olvideContraseña'>¿Olvidaste tu contraseña? </Link>
          </nav>
        </div>
      </div>
      <div className='imagenn'>
        <img src='/img/UNAH-DOCENTES.png' alt="UNAH-DOCENTES" />
      </div>
    </>
  )
}

export default Docentes;
*/

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function Docentes() {
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [passwordUser, setPasswordUser] = useState('');
    const [rol, setRol] = useState('docente');
    const [mensaje, setMensaje] = useState('');
   

    const navigate = useNavigate();

    const handleLogin = async (e) => {
      e.preventDefault();
  
      try {
          const response = await axios.post('http://localhost:8888/login', {
              nombreUsuario,
              passwordUser,
              rol,
          });
  
          if (response.data) {
              console.log('Guardando nombreUsuario en localStorage:', nombreUsuario);
              localStorage.setItem('nombreUsuario', nombreUsuario);
              setMensaje('Inicio de sesión exitoso para el rol de docente');
              navigate('/principalDocente');
          } else {
              throw new Error('Inicio de sesión fallido');
          }
  
      } catch (error) {
          console.error('Error en la autenticación:', error.message);
          setMensaje('Error en la autenticación');
      }
  };

    return (
        <>
            <div className='flex justify-center mt-28'>
                <div className='bg-white p-8 rounded-xl border shadow-lg max-w-md w-full'>
                    <h2 className='mb-6 text-3xl text-center font-bold font-label'>Iniciar Sesión <br /><span>Docente</span></h2>
                    <form onSubmit={handleLogin}>
                    <label className='block uppercase mb-2 font-bold text-gray-700 text-base font-label'>N° Cuenta</label>
                <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label'
                    placeholder='ej: 202350'
                    type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)}
                />

                <label className='block uppercase mb-2 font-bold text-gray-700 text-base font-label'>Clave</label>
                <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-7 bg-gray-100 font-label'
                    type='password'
                    placeholder='Tu Contraseña'
                    value={passwordUser} onChange={(e) => setPasswordUser(e.target.value)}
                />
                        <button
                            type='submit'
                            className='bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 font-medium w-full uppercase mb-9 font-label transition ease-in-out delay-50 hover:translate-y-1 hover:scale-90  duration-250'>Iniciar Sesión</button>
                    </form>
                    {mensaje && <p>{mensaje}</p>}
                    <nav>
                        <Link className='text-gray-500 hover:underline font-label' to='/olvideContraseña'>¿Olvidaste tu contraseña? </Link>
                    </nav>
                </div>
            </div>
            <div className='imagenn'>
                <img src='/img/UNAH-DOCENTES.png' alt="UNAH-DOCENTES" />
            </div>
        </>
    )
}

export default Docentes;


/* <label className='block uppercase mb-2 font-bold text-gray-700 text-base font-label'>N° Cuenta</label>
                <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label'
                    placeholder='ej: 202350'
                    type="text" value={nombreUsuario} onChange={(e) => setNombreUsuario(e.target.value)}
                />

                <label className='block uppercase mb-2 font-bold text-gray-700 text-base font-label'>Clave</label>
                <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-7 bg-gray-100 font-label'
                    type='password'
                    placeholder='Tu Contraseña'
                    value={passwordUser} onChange={(e) => setPasswordUser(e.target.value)}
                />
                <button
                    type='submit'
                    className='bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 font-medium w-full uppercase mb-9 font-label transition ease-in-out delay-50 hover:translate-y-1 hover:scale-90  duration-250'>Iniciar Sesión</button>
            </form>*/