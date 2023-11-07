import React from 'react'
import { useState,useEffect } from 'react'
import AlertaError from '../components/AlertaError';
import axios from 'axios';


function Registrar() {
    const [identidad, setIdentidad] = useState('');
    const [primerNombre, setPrimerNombre] = useState('');
    const [segundoNombre, setSegundoNombre] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [segundoApellido, setSegundoApellido] = useState('');
    const [carreraPrincipal, setCarreraPrincipal] = useState('');
    const [carreraSecundaria, setCarreraSecundaria] = useState('');
    const [email, setEmail] = useState('');
    const [imagen, setImagen] = useState(null);
    const [centroRegional, setCentroRegional] = useState('');
    
    const [alerta, setAlerta] = useState({});
    const [mostrarImagen, setMostrarImagen] = useState(false);

    
    

    useEffect(() => {
        const timer = setTimeout(() => {
        setMostrarImagen(true);
        }, 150); 
        return () => clearTimeout(timer);
    }, []);

    async function handleSubmit (e) {
        e.preventDefault()

        if ([identidad,primerNombre,primerApellido,carreraPrincipal,carreraSecundaria,email,centroRegional].includes('') || [imagen].includes(null)) {
            setAlerta({mensaje: 'Existen campos vacios', error: true})
            return;
        }

        if (/^[0-9]{13}$/.test(identidad)) {
            setAlerta({})
            //Limpiar Formulario
            setIdentidad('');
            setPrimerNombre('');
            setSegundoNombre('');
            setPrimerApellido('');
            setSegundoApellido('');
            setCarreraPrincipal('');
            setCarreraSecundaria('');
            setEmail('');
            setImagen(null);
            setCentroRegional('');
        } else {
            setAlerta({mensaje: 'Numero de identidad invalido', 
                        error: true})
        }
        


        // if (identidad.toString().length === 13) {
        //     setAlerta({mensaje: 'Numero de identidad incompleto', 
        //                 error: true})
        //     return;
        // }

        

        //registrar el usuario en la api
        try {
            const url ="http://localhost:"
            await axios.post(url,{identidad,nombreCompleto,segundoNombre,tercerNombre,primerApellido,segundoApellido,tercerApellido,carreraPrincipal,carreraSecundaria,email,imagen,centroRegional})
            setAlerta({
                mensaje:'Registro Exitoso!',
                error:false
            })
        } catch (error) {
            
        }
        

    }
        const {mensaje}= alerta

    return (
        <>
        
        <div className='grid grid-cols-2 justify-center mt-28 mb-40' >
            <div>
                <div className='text-left'>
                <h1 className='text-indigo-600 text-center font-black text-5xl  ml-12 '>
                    Proceso De Admision
                </h1>
                <p className='ml-32 mt-2  text-5xl font-black '>
                    Universidad Nacional 
                </p>
                <p className='text-center mt-2  text-5xl font-black'>
                Autonoma De Honduras
                </p>
                </div>

                <div className='ml-40 mt-14'>
                    <img className={mostrarImagen ? 'imagen-visible' : 'imagen-oculta'}
                    src="src/img/Puma-UNAH.png"
                    alt="Imagen"
                    />
                </div>
            </div>
            
            <div className='bg-white p-8 rounded-xl shadow-lg border w-10/12 ml-10'>
                <h2 className='text-indigo-600 mb-6 text-3xl text-center font-black font-label uppercase shadow-xl shadow-gray-500/80'>Inscripción <br /><span className='text-black'>UNAH</span></h2>

                {mensaje && <AlertaError 
                    alerta={alerta}
                />}


                <form 
                onSubmit={handleSubmit}
                
                >

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Identidad </label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label ' 
                    type='text'   
                    placeholder='ej: 0801197302222'
                    value={identidad}
                    onChange={(e) => {
                        setIdentidad(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Primer Nombre </label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Tu Primer Nombre'
                    value={primerNombre}
                    onChange={(e) => {
                        setPrimerNombre(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Segundo Nombre </label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Tu Segundo Nombre'
                    value={segundoNombre}
                    onChange={(e) => {
                        setSegundoNombre(e.target.value)
                    }
                    }
                    />

                    

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Primer Apellido </label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Tu Primer Apellido '
                    value={primerApellido}
                    onChange={(e) => {
                        setPrimerApellido(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Segundo Apellido </label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Tu Segundo Apellido'
                    value={segundoApellido}
                    onChange={(e) => {
                        setSegundoApellido(e.target.value)
                    }
                    }
                    />

                    

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Carrera Principal</label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Escribe Tu Carrera Principal'
                    value={carreraPrincipal}
                    onChange={(e) => {
                        setCarreraPrincipal(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Carrera Secundaria</label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Escribe Tu Carrera Secundaria'
                    value={carreraSecundaria}
                    onChange={(e) => {
                        setCarreraSecundaria(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >E-Mail</label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='email'   
                    placeholder='Tu Correo Personal'
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Foto Certificado De secundaria</label>
                    <input
                    
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                        const archivo=e.target.files[0];
                        setImagen(archivo);
                    }
                    }    
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label'>Selecciona el centro regional</label>
                    <select 
                    className='w-full p-2 border border-gray-300 rounded-md mb-8 bg-gray-100 font-label'
                    value={centroRegional}
                    onChange={(e) => {
                        setCentroRegional(e.target.value)
                    }
                    }
                    >
                    <option value='' disabled > -- Seleccione-- </option>
                    <option value='opcionCU'>UNAH-CU</option>
                    <option value='opcionVS'>UNAH-VS</option>
                    <option value='opcionCURC'>UNAH-CURC</option>
                    <option value='opcionCURLA'>UNAH-CURLA</option>
                    <option value='opcionCURLP'>UNAH-CURLP</option>
                    <option value='opcionCUROC'>UNAH-CUROC</option>
                    <option value='opcionCURNO'>UNAH-CURNO</option>
                    <option value='opcionDANLI'>UNAH-TEC Danli</option>
                    <option value='opcionAGUAN'>UNAH-TEC AGUÁN</option>
                    </select>

                    <button 
                        type='submit' 
                        className='bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 font-medium w-full uppercase mb-9 font-label shadow-lg shadow-indigo-400/100'>Enviar</button>
                        

                </form>

                
            </div>
            </div>         
        </>
    )
}

export default Registrar
