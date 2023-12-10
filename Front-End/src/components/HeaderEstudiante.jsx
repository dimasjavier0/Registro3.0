import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserContext } from '../components/UserContext';
import axios from 'axios';
function HeaderEstudiantes() {
    const navigate = useNavigate();
    const { user,clearUserContext } = useUserContext();

    
    //const userId = user ? user.user_id : null;

    const userId="201902345";

    const handleCerrarSesion = () => {
        const confirmar = window.confirm('¿Estás seguro de cerrar sesión?');
        if (confirmar) {
            clearUserContext();
            navigate('/');
        }
    };



    const verificarMatricula = async () => {
        try {
            const response = await axios.post('http://localhost:8888/matricula/matricular-estudiante', {
                numCuenta: userId, idProcesoMatricula: 34
            });
    
            if (response.status === 200) {
                navigate('/principalMatricula');
            } else {
                alert('No puedes matricularte en este momento. Tu día de matrícula es: ' + response.data.proximaFecha);
            }
        } catch (error) {
            console.error('Error al verificar la matrícula:', error);
            alert('No puedes matricularte en este momento. Tu día de matrícula es: ');
        }
    };



    return (
        <div className='h-full flex fixed'>
            <aside className=' bg-yellow-400'>
                    <div className=' mt-5 ml-36'>
                    <button
                    className='transition bg-gray-100 text-orange-900 ml-8 font-bold text-lg ease-in-out shadow-md hover:shadow-white rounded-lg py-0 px-5 border-gray-500 border-2 pb-1'
                    onClick={handleCerrarSesion}>Cerrar Sesión</button>

                    {/* <Link
                    to='/' 
                    className=" ml-48 ">
                    <i className="text-white fa-regular fa-share-from-square fa-rotate-180 fa-2xl"></i>
                    </Link> */}
                    </div>

                <div className=' mr-16'>
                <div>
                <h1 className='text-4xl ml-8 
                font-black text-center text-white mt-10'>Área personal <br />
                <p>estudiante</p>
                </h1>
                <img className=' w-44 h-40 ml-20 mb-8 mt-10' src="/img/vista-estudiante.png" alt="Seguridad" /> 
                <nav className=''>
                    <Link to={`/principalEstudiante/perfilEstudiante/${userId}`}>
                        <button className='transition bg-gray-100 text-orange-900 ml-8 font-bold text-lg ease-in-out  hover:scale-110 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-gray-500 border-2 pb-1'>
                            Perfil
                        </button>
                    </Link> 

                    <Link to='#' onClick={verificarMatricula}>
                        <button className='transition bg-gray-100 block mt-7 ml-8 text-orange-900 font-bold text-lg ease-in-out  hover:scale-110 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-gray-500 border-2 pb-1'>
                            Matricula
                        </button>
                    </Link>

                    <Link to='/principalSolicitudes'>
                        <button className='transition bg-gray-100 block mt-7 ml-8 text-orange-900 font-bold text-lg ease-in-out  hover:scale-110 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-gray-500 border-2 pb-1'>
                            Solicitudes
                        </button>
                    </Link>

                    <Link to='#'>
                        <button className='transition bg-gray-100 block mt-7 ml-8 text-orange-900 font-bold text-lg ease-in-out  hover:scale-110 shadow-md hover:shadow-white rounded-lg py-0 px-5 border-gray-500 border-2 pb-1'>
                            Certificado Académico
                        </button>
                    </Link>
                </nav>
                </div>
                </div>
            </aside>
        </div>
        
    )
}

export default HeaderEstudiantes