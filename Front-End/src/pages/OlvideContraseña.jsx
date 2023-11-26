import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertaError from '../components/AlertaError';
import axios from 'axios';


function OlvideContraseña() {
  const [email, setEmail] = useState('');
  const [alerta, setAlerta] = useState({});
  const [respuestaServidor, setRespuestaServidor] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if ([email].includes('')) {
      setAlerta({mensaje: 'Existen campos vacios', error: true})
      return;   
  }
  setAlerta({})

    try {
      const url = 'http://localhost:8888/cr7/usuarios';
      const data = {
        correo: email,
      };

      const respuesta = await axios.put(url, data);

      setRespuestaServidor(respuesta.data);
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };



  const { mensaje, error } = alerta; // Desestructuración para usar en JSX


    return (
        <>
        <div className='grid grid-cols-2 justify-center mt-28 mb-40' >

            <div>
                <div className='text-center'>
                <h1 className='text-indigo-600 text-center font-black text-6xl  ml-12 '>
                    Recupera Tu Acceso
                </h1>
                <p className='mt-2  text-6xl font-black text-center '>
                    Y No Pierdas Tu 
                </p>
                <p className='text-center mt-2  text-6xl font-black'>
                Cuenta
                </p>
                </div>

            </div>
            
            <div className='bg-white p-8 rounded-xl shadow-lg border w-10/12 ml-10'>
                <h2 className='text-indigo-600 mb-6 text-3xl text-center font-black font-label uppercase '>Recupera Tu Cuenta <br /><span className='text-black'>UNAH</span></h2>

                {respuestaServidor && (
            <div>
              {respuestaServidor.result ? (
                <p>
                  Se ha enviado un correo al correo: {email}. Con mensaje:{' '}
                  {respuestaServidor.mensaje}
                </p>
              ) : (
                <p>
                  Hubo un problema al procesar la solicitud. Por favor,
                  inténtalo de nuevo.
                </p>
              )}
            </div>
          )}

                {mensaje && <AlertaError 
                    alerta={alerta}
                />}
                <form 
                onSubmit={handleSubmit}
                >

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >E-Mail</label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='email'   
                    placeholder='Escribe tu correo electronico'
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }
                    }
                    />

                    <div className='flex justify-end mr-0 mt-10'>
                        <button 
                            type='submit' 
                            className='bg-indigo-600 duration-300 transition ease-in-out delay-50 hover:translate-y-1 hover:scale-110 mr-10 text-white py-2 px-8 rounded-lg hover:bg-indigo-700 font-medium  uppercase mb-9 font-label shadow-lg shadow-indigo-400/100'>Enviar
                        </button>
                        

                        <Link className='text-gray-500 hover:underline font-label' to='#' onClick={() => window.history.back()}>
                        <button className=' bg-rose-600 duration-300 transition ease-in-out hover:translate-y-1 hover:scale-110  text-white py-2 px-4 rounded-lg hover:bg-rose-700 font-medium  uppercase font-label shadow-lg shadow-rose-400/80'>
                            Cancelar
                        </button>
                        </Link>
                        
                    </div>
                    
                        
                </form> 
                    
                

                
            </div>
            </div>         
        </>
    )
}

export default OlvideContraseña;

