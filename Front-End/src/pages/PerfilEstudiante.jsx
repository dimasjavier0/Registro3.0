import React, { useState,useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../components/UserContext';

function PerfilEstudiante() {

    const [fotos, setFotos] = useState([]);
    const [estudiante, setEstudiante] = useState(null);
    const { user } = useUserContext();
    const { numeroCuenta } = useParams();

    useEffect(() => {
        const obtenerEstudiante = async () => {
            try {
                if (user) {
                    const response = await axios.get(`http://localhost:8888/api/estudiante/${user.user_id}`);
                    setEstudiante(response.data);
                }
            } catch (error) {
                console.error('Error al obtener el estudiante:', error);
            }
        };

        obtenerEstudiante();
    }, [user]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        
        onDrop: (acceptedFiles) => {
          // Limitar la cantidad de fotos a un máximo de 3
            const nuevasFotos = [...fotos, ...acceptedFiles.slice(0, 3 - fotos.length)];
            setFotos(nuevasFotos);
            },
        });
        
        const handleUpload = async () => {
            const formData = new FormData();
            formData.append('id_estudiante', numeroCuenta);
        
            for (let i = 0; i < fotos.length; i++) {
            formData.append('fotos', fotos[i]);
            }
        
            try {
            const response = await axios.post('http://localhost:8888/fotos/upload', formData);
            console.log(response.data);
            setFotos([])
            } catch (error) {
            console.error('Error al subir las fotos:', error);
            }
        };
        
    return (
        <>
        <div className='grid grid-cols-3' >
            
            <div className='col-span-2'>
            <h1 className="text-4xl font-label font-bold mt-10  mb-4">Perfil del estudiante</h1>
            
            <div className='mb-10 mt-10 bg-yellow-500 p-2 rounded-lg'>
                <h2 className=' text-xl ml-4 text-white font-label font-bold'>Datos Generales</h2>
            </div>
            
                <div className=''>
                {estudiante && (
                <div>
                <div className=' text-left'>
                <label className='uppercase mb-2 font-bold mr-28 -ml-1  text-gray-700 text-base font-label' >Nombre(s)</label>
                <input type="text" 
                className=' text-left p-2 w-80 border ml-1 border-gray-300 rounded-md mb-4 bg-gray-100 font-label'
                placeholder={`${estudiante.primer_nombre} ${estudiante.segundo_nombre}`}
                disabled
                />
                </div>

                <div className='ml-1'>
                <label className='uppercase mb-2 font-bold mr-28 -ml-2  text-gray-700 text-base font-label' >Apellido(s)</label>
                <input type="text" 
                className=' text-left p-2 w-80 border  border-gray-300 rounded-md mb-4 bg-gray-100 font-label'
                placeholder={`${estudiante.primer_apellido} ${estudiante.segundo_apellido}`}
                disabled
                />
                </div>

                <div className=''>
                <label className='uppercase mb-2 font-bold  mr-36  -ml-1   text-gray-700 text-base font-label' >Carrera</label>
                <input type="text" 
                className=' text-left p-2 w-80 border -ml-2 border-gray-300 rounded-md mb-4 bg-gray-100 font-label'
                placeholder={`${estudiante.nombre_carrera}`}
                disabled
                />

                </div>
                <div className=''>
                <label className='uppercase mb-2 font-bold  mr-36  -ml-1   text-gray-700 text-base font-label' >Correo</label>
                <input type="text" 
                className=' text-left p-2 w-80 border  border-gray-300 rounded-md mb-4 bg-gray-100 font-label'
                placeholder={`${estudiante.correo_institucional}`}
                disabled
                />
                </div>
                </div>
                )}

                
            {/* Reservado Para la descripcion de los usuarios y demas detalles */}
            <form >
                    
            </form>
            </div>
            </div>
        </div>

        {/* Bloque de Fotos */}
        <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow-md ml-20">
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Fotos</h2>
            <div
            {...getRootProps()}
            className={`border border-dashed border-gray-300 p-4 ${
                isDragActive ? 'bg-gray-200' : ''
            }`}
            >
            <input {...getInputProps()} />

            <p className="text-gray-500">
                <i className="fas fa-solid fa-arrow-up-from-bracket fa-xl ml-2 mr-4"></i>
                Puedes arrastrar y soltar aquí, o haz clic para seleccionar tus fotos
            </p>
            </div>
            <div className="mt-4">
            {fotos.map((foto, index) => (
                <img
                key={index}
                src={URL.createObjectURL(foto)}
                alt={`Foto ${index + 1}`}
                className="w-20 h-20 object-cover rounded-full inline-block mr-2"
                />
            ))}
            </div>
            <button 
            className='bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 font-medium w-full uppercase mb-9 font-label shadow-lg shadow-yellow-300/70'
            onClick={handleUpload}>Subir Fotos
            </button>
        </div>
        </div>
    
        </>
    )
}

export default PerfilEstudiante