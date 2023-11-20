import React from 'react'
import { useState } from 'react'
import AlertaError from '../components/AlertaError';
import { Link } from 'react-router-dom';





function RegistrarDocentes() {
    const [numeroEmpleado, setNumeroEmpleado] = useState('');
    const [nombre, setNombre] = useState('');
    const [fotografia, setFotografia] = useState(null);
    const [centroRegional, setCentroRegional] = useState('');
    
    const [alerta, setAlerta] = useState({});


    //Evitamos que el usuario ingrese numeros en los campos de tipo=texto
    const handleKeyDown = (event) => {
        const key = event.key; 
        if (/[0-9]/.test(key)) {
            event.preventDefault();
        }
    };
    
    function handleSubmit (e) {
        e.preventDefault();

        //Validar que no existan campos vacios
        if ([numeroEmpleado,nombre,centroRegional].includes('') || [fotografia].includes(null)) {
            setAlerta({mensaje: 'Existen campos vacios', error: true})
            return;
        }

        //Validar que el numero de Empleado sea de 11 digitos
        if (/^[0-9]{6}$/.test(numeroEmpleado)) {
            setAlerta({})
            
        } else {
            setAlerta({mensaje: 'Numero de empleado invalido', 
                        error: true})
                        return;
        }


        //Limpiar Formulario
        setNumeroEmpleado('');
        setNombre('');
        setCentroRegional('');
        //Limpiamos la Imagen
        document.getElementById('Fotografia').value = null;
        setCentroRegional('');
    }
        const {mensaje}= alerta

    return (
        <>
        
        <div className='grid grid-cols-3' >
            
            
            <div className=' mt-6 col-span-2 '>
            <div className='bg-white p-8 rounded-xl shadow-2xl border  ml-10'>
                <h2 className='text-indigo-600 mb-6 text-3xl text-center font-black font-label  uppercase shadow-xl shadow-gray-500/80'>Nuevo Docente <br /><span className='text-black'>UNAH</span></h2>

                {mensaje && <AlertaError 
                    alerta={alerta}
                />}


                <form 
                onSubmit={handleSubmit}
                
                >

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Numero Empleado </label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label ' 
                    type='text'   
                    placeholder='ej: 2023111'
                    value={numeroEmpleado}
                    onChange={(e) => {
                        setNumeroEmpleado(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Nombre </label>
                    <input
                    className='w-full p-2 lowercase border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Nombre Completo'
                    value={nombre}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setNombre(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Fotografia</label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='file'
                    id='Fotografia'
                    accept='image/*'
                    onChange={(e) => {
                        const archivo = e.target.files[0];
                        if (archivo) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const convertirBase64 = reader.result;
                            setFotografia(convertirBase64);
                        };
                        reader.readAsDataURL(archivo);
                        }
                    }}    
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
                    <option value={1}>UNAH-CU</option>
                    <option value={2}>UNAH-VS</option>
                    <option value={3}>UNAH-CURC</option>
                    </select>

                
                        <div className='flex justify-end mr-0 mt-3 font-bold'>
                        <button 
                            type='submit' 
                            className='bg-indigo-600  mr-10 text-white py-2 px-8 rounded-lg hover:bg-indigo-700 font-medium  uppercase mb-2 font-label shadow-lg shadow-indigo-400/100'>Guardar
                        </button>
                        

                        <Link className='text-gray-500 hover:underline font-label' to='/administracion'>
                        <button className=' bg-rose-600   text-white py-2 px-8 rounded-lg hover:bg-rose-700 font-medium  uppercase font-label shadow-lg shadow-rose-400/80'>
                            Cancelar
                        </button>
                        </Link>
                    </div>
                </form>

                </div>    
            </div>
            </div>         
        </>
    )
}

export default RegistrarDocentes
