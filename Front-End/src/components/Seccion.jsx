import React, { useState } from 'react';

const Seccion = ({ asignatura, onSelectSeccion }) => {
// ejemplos secciones de acuerdo a la signatura
const secciones = {
    'Asignatura A1': ['Sección A1.1', 'Sección A1.2', /* ... */],
    'Asignatura A2': ['Sección A2.1', 'Sección A2.2', /* ... */],
    'Asignatura B1': ['Sección B1.1', 'Sección B1.2', /* ... */],
    'Asignatura B2': ['Sección B2.1', 'Sección B2.2', /* ... */],
    'Asignatura At1': ['Sección at1.1', 'Sección at1.2', /* ... */],
    'Asignatura At2': ['Sección at2.1', 'Sección at2.2', /* ... */],
};

const seccionesAsignatura = secciones[asignatura];
const [seccionSeleccionada, setSeccionSeleccionada] = useState(null);

const handleSeccionClick = (seccion) => {
    onSelectSeccion(seccion);
    setSeccionSeleccionada(seccion);
};

return (
    <div>
    <ul>
        {seccionesAsignatura.map((seccion) => (
        <li
            key={seccion}
            onClick={() => handleSeccionClick(seccion)}
            className={`cursor-pointer ${seccionSeleccionada === seccion ? 'bg-blue-500/90 text-white' : ''}`}
        >
            {seccion}
        </li>
        ))}
    </ul>

    </div>
);
};

export default Seccion;
