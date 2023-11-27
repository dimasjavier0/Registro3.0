
import React from 'react'
import { useState,useEffect } from 'react'
import AlertaError from '../components/AlertaError';
import { Link } from 'react-router-dom';
import axios from 'axios';





function RegistrarDocentes() {
    const [Identidad, setIdentidad] = useState('');
    const [numeroEmpleado, setNumeroEmpleado] = useState('');
    const [Primernombre, setPrimerNombre] = useState('');
    const [Segundonombre, setSegundoNombre] = useState('');
    const [PrimerApellido, setprimerApellido] = useState('');
    const [SegundoApellido, setSegundoApellido] = useState('');
    const [fotografia, setFotografia] = useState(null);
    const [centroRegional, setCentroRegional] = useState('');
    const [Departamento, setDepartamento] = useState('');
    const [correo, setcorreo] = useState('');
    
    const [alerta, setAlerta] = useState({});
    const [departamentos, setDepartamentos] = useState([]);

    const correoRegex = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //Evitamos que el usuario ingrese numeros en los campos de tipo=texto
    const handleKeyDown = (event) => {
        const key = event.key; 
        if (/[0-9]/.test(key)) {
            event.preventDefault();
        }
    };
    

    useEffect(() => {
        /**  Función para obtener las carreras*/
        const obtenerDepartamentos = async () => {
        try {
            const resultado = await axios.get('http://localhost:8888/departamentos');
            if (resultado.data && resultado.data.result) {
                setDepartamentos(resultado.data.result);
            }
        } catch (error) {
            console.error('Error al obtener departamentos:', error);
        }
    };

    // Llamada a la función para obtener las carreras
    obtenerDepartamentos();
    }, []);
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        //Validar que no existan campos vacios
        const datosFormulario=[Identidad,numeroEmpleado,Primernombre,PrimerApellido,correo,fotografia,centroRegional,Departamento]
        const nombreCampos = ['Identidad','Numero empleado', 'Primer nombre', 'Primer apellido', 'Correo','Fotografia', 'Centro Regional','Departamento'];
        
        for (let i = 0; i < datosFormulario.length; i++) {
            if (datosFormulario[i] === '' || datosFormulario[i]=== null) {
            setAlerta({ mensaje: `El campo ${nombreCampos[i]} está vacío`, error: true });
            //window.scrollTo(0, 0);
            return;
            }
        }

        //Validar que el numero de identidad sea de 13 digitos
        if (/^[0-9]{13}$/.test(Identidad)) {
            setAlerta({})       
        } else {
            setAlerta({mensaje: 'Numero de identidad invalido', 
                        error: true})
                        //window.scrollTo(0, 0);
                        return;
        }

        //Validar que el numero de empleado sea de 6 digitos
        if (/^[0-9]{6}$/.test(numeroEmpleado)) {
            setAlerta({})       
        } else {
            setAlerta({mensaje: 'Numero de empleado invalido', 
                        error: true})
                        //window.scrollTo(0, 0);
                        return;
        }

        //Validar el correo electronico del usuario
            
        if (!correoRegex.test(correo)) {
            setAlerta({mensaje: 'Correo electronico invalido', 
            error: true}) 
            return;
        } else {
        setAlerta({});
        }


        const docenteData = {
            numeroEmpleado,
            Identidad:Identidad,
            primerNombre: Primernombre,
            segundoNombre: Segundonombre,
            primerApellido: PrimerApellido,
            segundoApellido: SegundoApellido,
            correo:correo,
            centroRegional:centroRegional,
            departamento: Departamento,
            fotografia // Asegúrate de que esto sea una cadena en formato Base64
        };
    


        try {

            const validacionResp = await axios.post('http://localhost:8888/docentesvalidar/validar', {
                Identidad,
                numeroEmpleado,
            });
        
            if (validacionResp.data.identidadExiste || validacionResp.data.numeroEmpleadoExiste) {
            let mensajeError = '';
            if (validacionResp.data.identidadExiste) {
            mensajeError += 'La identidad ya existe o  ';
            }
            if (validacionResp.data.numeroEmpleadoExiste) {
            mensajeError += 'El número de empleado ya existe.';
            }
            setAlerta({ mensaje: mensajeError, error: true });
            } else {
            // Enviar los datos al backend
            const response = await axios.post('http://localhost:8888/docentes/agregarDocente', docenteData);
            console.log(response.data);
            // Manejar la respuesta aquí...

            console.log('Registro exitoso:', response.data);
            setAlerta({mensaje: 'Registro Exitoso!', 
            error: false}) 
            //Limpiar Formulario
            setIdentidad('');
            setNumeroEmpleado('');
            setPrimerNombre('');
            setSegundoNombre('');
            setprimerApellido('');
            setSegundoApellido('');
            setcorreo('');
            document.getElementById('Fotografia').value = null;
            setCentroRegional('');
            setDepartamento('');
            }
        } catch (error) {
            console.error('Hubo un error al enviar los datos', error);
            setAlerta({ mensaje: 'Error al enviar los datos', error: true });
            // Manejar el error aquí...
        }
    }
        const {mensaje}= alerta

    return (
        <>
        
        <div className='grid grid-cols-3' >
            
            
            <div className=' mt-14 col-span-2 '>
            <div className='bg-white p-8 rounded-xl shadow-2xl border  ml-10 '>
                <h2 className='text-indigo-600 mb-6 text-3xl text-center font-black font-label  uppercase shadow-xl shadow-gray-500/80'>Nuevo Docente <br /><span className='text-black'>UNAH</span></h2>

                {mensaje && <AlertaError 
                    alerta={alerta}
                />}


                <form 
                onSubmit={handleSubmit}
                className=' h-96 overflow-y-auto'
                >
                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Identidad</label>
                    <input
                    className='w-full p-2  border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='ej: 0801197302222'
                    value={Identidad}
                    onChange={(e) => {
                        setIdentidad(e.target.value)
                    }
                    }
                    />



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

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Primer Nombre </label>
                    <input
                    className='w-full p-2  border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Primer nombre'
                    value={Primernombre}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setPrimerNombre(e.target.value)
                    }
                    }
                    />
                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Segundo Nombre </label>
                    <input
                    className='w-full p-2  border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Segundo Nombre'
                    value={Segundonombre}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setSegundoNombre(e.target.value)
                    }
                    }
                    />
                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Primer Apellido </label>
                    <input
                    className='w-full p-2  border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Primer Apellido'
                    value={PrimerApellido}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setprimerApellido(e.target.value)
                    }
                    }
                    />
                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Segundo Apellido </label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Segundo Apellido'
                    value={SegundoApellido}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setSegundoApellido(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Correo</label>
                    <input
                    id='email'
                    className='w-full p-2  border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='correo@example.com'
                    value={correo}
                    onChange={(e) => {
                        setcorreo(e.target.value)
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

                    <label className='block uppercase mb-2 font-bold text-gray-700 text-base font-label'>Departamento</label>
                    <select
                        className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label'
                        value={Departamento}
                        onChange={(e) => {
                            setDepartamento(e.target.value);
                        }}
                    >  <option value='' disabled>-- Seleccione --</option>
                    {departamentos.map((departamento) => (
                        <option key={departamento.id_dep_academico} value={departamento.id_dep_academico}>
                            {departamento.nombre}
                        </option>
                    ))}
                </select>

                
                        <div className='flex justify-end mr-0 mt-3 font-bold mb-4'>
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
/*
export default RegistrarDocentes
import React from 'react'
import { useState } from 'react'
import AlertaError from '../components/AlertaError';
import { Link } from 'react-router-dom';
import axios from 'axios';





function RegistrarDocentes() {
    const [Identidad, setIdentidad] = useState('');
    const [numeroEmpleado, setNumeroEmpleado] = useState('');
    const [Primernombre, setPrimerNombre] = useState('');
    const [Segundonombre, setSegundoNombre] = useState('');
    const [PrimerApellido, setprimerApellido] = useState('');
    const [SegundoApellido, setSegundoApellido] = useState('');
    const [fotografia, setFotografia] = useState(null);
    const [centroRegional, setCentroRegional] = useState('');
    const [Departamento, setDepartamento] = useState('');
    const [correo, setcorreo] = useState('');
    
    const [alerta, setAlerta] = useState({});


    //Evitamos que el usuario ingrese numeros en los campos de tipo=texto
    const handleKeyDown = (event) => {
        const key = event.key; 
        if (/[0-9]/.test(key)) {
            event.preventDefault();
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();

      /*  //Validar que no existan campos vacios
        if ([numeroEmpleado,Primernombre,Primernombre, Segundonombre, PrimerApellido, SegundoApellido, correo, centroRegional, Departamento].includes('') || [fotografia].includes(null)) {
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
                   
        } /*
        const docenteData = {
            numeroEmpleado,
            Identidad:Identidad,
            primerNombre: Primernombre,
            segundoNombre: Segundonombre,
            primerApellido: PrimerApellido,
            segundoApellido: SegundoApellido,
            correo:correo,
            centroRegional:centroRegional,
            departamento: Departamento,
            fotografia // Asegúrate de que esto sea una cadena en formato Base64
        };
    


        try {

            const validacionResp = await axios.post('http://localhost:8888/docentesvalidar/validar', {
                Identidad,
                numeroEmpleado,
                
              });
        
              if (validacionResp.data.identidadExiste || validacionResp.data.numeroEmpleadoExiste) {
                let mensajeError = '';
               // if (validacionResp.data.identidadExiste) {
                  mensajeError += 'La identidad o empleado ya existe. ';
                //}
                //if (validacionResp.data.numeroEmpleadoExiste) {
                  //mensajeError += 'El número de empleado ya existe.';
                //}
                setAlerta({ mensaje: mensajeError, error: true });
              } else {
            // Enviar los datos al backend
            const response = await axios.post('http://localhost:8888/docentes/agregarDocente', docenteData);
            console.log(response.data);


 console.log('Registro exitoso:', response.data);
            // Limpiar el formulario si es necesario
              }
        } catch (error) {
            console.error('Hubo un error al enviar los datos', error);
            setAlerta({ mensaje: 'Error al enviar los datos', error: true });
            // Manejar el error aquí...
        }
    




        //Limpiar Formulario
        setNumeroEmpleado('');
       
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
                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Identidad</label>
                    <input
                    className='w-full p-2 lowercase border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Nombre Completo'
                    value={Identidad}
                    onChange={(e) => {
                        setIdentidad(e.target.value)
                    }
                    }
                    />



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

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Primer Nombre </label>
                    <input
                    className='w-full p-2 lowercase border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Nombre Completo'
                    value={Primernombre}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setPrimerNombre(e.target.value)
                    }
                    }
                    />
                     <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Segundo Nombre </label>
                    <input
                    className='w-full p-2 lowercase border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Nombre Completo'
                    value={Segundonombre}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setSegundoNombre(e.target.value)
                    }
                    }
                    />
                     <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Primer Apellido </label>
                    <input
                    className='w-full p-2 lowercase border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Nombre Completo'
                    value={PrimerApellido}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setprimerApellido(e.target.value)
                    }
                    }
                    />
                     <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Segundo Apellido </label>
                    <input
                    className='w-full p-2 lowercase border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Nombre Completo'
                    value={SegundoApellido}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setSegundoApellido(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Correo</label>
                    <input
                    className='w-full p-2 lowercase border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Nombre Completo'
                    value={correo}
                   // onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setcorreo(e.target.value)
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

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label'>Selecciona el Departamento</label>
                    <select 
                    className='w-full p-2 border border-gray-300 rounded-md mb-8 bg-gray-100 font-label'
                    value={Departamento}
                    onChange={(e) => {
                        setDepartamento(e.target.value)
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
*/
export default RegistrarDocentes