import React from 'react'
import { useState,useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import { useLocation } from 'react-router-dom';




function Principal() {
    const [seleccionOpcion, setSeleccionOpcion] = useState(null); 
    
    const location = useLocation();

    useEffect(() => {
            const almacenar = localStorage.getItem('seleccionOpcion');
            
            if (almacenar && location.pathname === '/estudiantes'|| location.pathname === '/docentes' ||location.pathname === '/Administrador') {
            setSeleccionOpcion(almacenar);
            } else {
            setSeleccionOpcion(null);
            localStorage.removeItem('seleccionOpcion');
            }
        }, [location]);
    return (
        <div className={`${seleccionOpcion === 'Estudiante' ? ' delay-100 duration-500 bg-yellow-300' : seleccionOpcion === 'Docente' ? 'delay-100 duration-500 bg-blue-500' :seleccionOpcion === 'Administrador' ? 'delay-100 duration-500 bg-blue-800 ':null} min-h-screen`}>

            <Header 
            seleccionOpcion={seleccionOpcion} 
            setSeleccionOpcion={setSeleccionOpcion}
            />

            <main className="p-1">
            <Outlet />
            </main>
            
        </div>
        );
    }
export default Principal;