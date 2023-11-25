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
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [imagen, setImagen] = useState(null);
    const [centroRegional, setCentroRegional] = useState('');
    
    const [alerta, setAlerta] = useState({});
    const [mostrarImagen, setMostrarImagen] = useState(false);
    const [carreras, setCarreras] = useState([]); // Estado para almacenar las carreras



    //Evitamos que el usuario ingrese numeros en los campos de tipo=texto
    const handleKeyDown = (event) => {
        const key = event.key; 
        if (/[0-9]/.test(key)) {
            event.preventDefault();
        }
    };

    useEffect(() => {
        /**  Función para obtener las carreras*/
        const obtenerCarreras = async () => {
            try {
                const resultado = await axios.get('http://localhost:8888/carreras');
                if (resultado.data && resultado.data.result) {
                    setCarreras(resultado.data.result);
                }
            } catch (error) {
                console.error('Error al obtener carreras:', error);
            }
        };

        // Llamada a la función para obtener las carreras
        obtenerCarreras();

        /* Datos simulados de las carreras
        const datosCarrerasSimulados = [
            { "id_carrera": 1, "nombre_carrera": "Periodismo", "puntaje_minimo_PAA": 900 },
            { "id_carrera": 2, "nombre_carrera": "Historia", "puntaje_minimo_PAA": 700 },
            { "id_carrera": 3, "nombre_carrera": "Ingeniería en Sistemas", "puntaje_minimo_PAA": 1000 },
            { "id_carrera": 4, "nombre_carrera": "Medicina", "puntaje_minimo_PAA": 1100 },
            { "id_carrera": 5, "nombre_carrera": "Enfermería", "puntaje_minimo_PAA": 900 }
        ];*/

        // Establecer los datos simulados en el estado
        //setCarreras(datosCarrerasSimulados);

        const timer = setTimeout(() => {
            setMostrarImagen(true);
        }, 150); 
        return () => clearTimeout(timer);

    }, []); // Dependencias vacías para que se ejecute una sola vez al montar el componente


    async function handleSubmit (e) {
        e.preventDefault()

        //Validar que no existan campos vacios
        const datosFormulario=[identidad,primerNombre,primerApellido,carreraPrincipal,carreraSecundaria,telefono,email,imagen,centroRegional]
        const nombreCampos = ['Identidad', 'Primer nombre', 'Primer apellido', 'Carrera principal','Carrera secundaria', 'Teléfono', 'Correo Personal','Imagen','Centro regional'];
        
        for (let i = 0; i < datosFormulario.length; i++) {
            if (datosFormulario[i] === '' || datosFormulario[i]=== null) {
            setAlerta({ mensaje: `El campo ${nombreCampos[i]} está vacío`, error: true });
            window.scrollTo(0, 0);
            return;
            }
        }

        //Validar que el numero de identidad sea de 13 digitos
        if (/^[0-9]{13}$/.test(identidad)) {
            setAlerta({})
            
        } else {
            setAlerta({mensaje: 'Numero de identidad invalido', 
                        error: true})
                        window.scrollTo(0, 0);
                        return;
        }

        if (/^[0-9]{8}$/.test(telefono)) {
            setAlerta({})
        
        } else {
            setAlerta({mensaje: 'Numero de telefono invalido', 
                        error: true})
                        window.scrollTo(0, 0);
                        return;
        }

        try {
            // Construir el objeto FormData para enviar la imagen correctamente
            const formData = new FormData();
            formData.append('identidad', identidad);
            formData.append('primerNombre', primerNombre);
            formData.append('segundoNombre', segundoNombre);
            formData.append('primerApellido', primerApellido);
            formData.append('segundoApellido', segundoApellido);
            formData.append('carreraPrincipal', carreraPrincipal);
            formData.append('carreraSecundaria', carreraSecundaria);
            formData.append('telefono', telefono);
            formData.append('email', email);
            formData.append('imagen', imagen);
            formData.append('centroRegional', centroRegional);
    
                let dataAspirante = {
            p_nombre:primerNombre,
            s_nombre:segundoNombre,
            p_apellido:primerApellido,
            s_apellido:segundoApellido,
            carrera_P:carreraPrincipal,
            carrera_S:carreraSecundaria,
            identidad:identidad,
            foto:imagen,
            cel:telefono,
            correoPersonal:email,
            carreraPrincipal:"1",
            carreraSecundaria:"2",
            centroRegional:"1",
            estado:"1"
                };
    
            let config = {
                // por defecto es get
                method: 'post', // Puedes usar 'get', 'post', 'put', 'delete', etc.
                // por defecto el index.html
                url: 'http://localhost:8888/aspirantes',
                data: dataAspirante, // Los datos que deseas enviar en formato JSON
                headers: {
                'Content-Type': 'application/json' // Indicar que los datos son JSON
                }
                };
    
            // Realizamos la petición POST
    
                await axios(config)
                .then(response => {
                    //console.log('config:',this.config)
                    console.log('Respuesta del servidor:', response.data);        
        
                })
                .catch(error => {
                    console.log('Error al enviar la petición ', error);
                    return;
        
                });
        
                // Agregamos un comentario para indicar que la petición se realizó correctamente
                console.log('Petición POST realizada con éxito');
                setAlerta({
                mensaje: 'Registro Exitoso!',
                error: false,
                });
                //Limpiar Formulario
                setIdentidad('');
                setPrimerNombre('');
                setSegundoNombre('');
                setPrimerApellido('');
                setSegundoApellido('');
                setCarreraPrincipal('');
                setCarreraSecundaria('');
                setTelefono('')
                setEmail('');
                document.getElementById('Imagen').value = null;
                setCentroRegional('');
                window.scrollTo(0, 0);
        
            }catch (error) {
            console.error('Error en la petición:', error);
            setAlerta({
                mensaje: 'Error al enviar la petición',
                error: true,
            });
            return;
        }
        
}
        const {mensaje}= alerta

    return (
        <>
        
        <div className='grid grid-cols-2 justify-center mt-28 mb-40' >
            <div>
                <div className='text-left'>
                <h1 className='text-indigo-600 text-center font-black text-5xl  ml-12 '>
                    Proceso de Admisión
                </h1>
                <p className='ml-32 mt-2  text-5xl font-black '>
                    Universidad Nacional 
                </p>
                <p className='text-center mt-2  text-5xl font-black'>
                Autonoma de Honduras
                </p>
                </div>

                <div className='ml-40 mt-14 '>
                    <img className={mostrarImagen ? 'imagen-visible ' : 'imagen-oculta'}
                    src="/img/Puma-UNAH.png"
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
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setPrimerNombre(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Segundo Nombre </label>
                    <input
                    className='w-full  p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Tu Segundo Nombre'
                    value={segundoNombre}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setSegundoNombre(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Primer Apellido </label>
                    <input
                    className='w-full  p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Tu Primer Apellido '
                    value={primerApellido}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setPrimerApellido(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Segundo Apellido </label>
                    <input
                    className='w-full  p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='Tu Segundo Apellido'
                    value={segundoApellido}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setSegundoApellido(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold text-gray-700 text-base font-label'>Carrera Principal</label>
                    <select
                        className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label'
                        value={carreraPrincipal}
                        onChange={(e) => {
                            setCarreraPrincipal(e.target.value);
                        }}
                    >
                        <option value='' disabled>-- Seleccione --</option>
                        {carreras.map((carrera) => (
                            <option key={carrera.id_carrera} value={carrera.id_carrera}>
                                {carrera.nombre_carrera}
                            </option>
                        ))}
                    </select>

                    <label className='block uppercase mb-2 font-bold text-gray-700 text-base font-label'>Carrera Secundaria</label>
                    <select
                        className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label'
                        value={carreraSecundaria}
                        onChange={(e) => {
                            setCarreraSecundaria(e.target.value);
                        }}
                    >
                        <option value='' disabled>-- Seleccione --</option>
                        {carreras.map((carrera) => (
                            <option key={carrera.id_carrera} value={carrera.id_carrera}>
                                {carrera.nombre_carrera}
                            </option>
                        ))}
                    </select>

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Teléfono</label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='text'   
                    placeholder='ej: 99887755'
                    value={telefono}
                    onChange={(e) => {
                        setTelefono(e.target.value)
                    }
                    }
                    />

                    <label className='block uppercase mb-2 font-bold  text-gray-700 text-base font-label' >Correo Personal</label>
                    <input
                    className='w-full p-2 border border-gray-300 rounded-md mb-4 bg-gray-100 font-label' 
                    type='email'   
                    placeholder='ej: correo@example.com'
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
                    id='Imagen'
                    accept='image/*'
                    onChange={(e) => {
                        const archivo = e.target.files[0];
                        if (archivo) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            const convertirBase64 = reader.result;
                            setImagen(convertirBase64);
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

