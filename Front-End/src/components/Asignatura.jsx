import React, { useState } from 'react';

const Asignatura = ({ departamento, onSelectAsignatura }) => {
// ejemplo asignaturas de acuerdo al departamento
const asignaturas = {
    'Astronomía': ['Asignatura A1', 'Asignatura A2', /* ... */],
    'Biología': ['Asignatura B1', 'Asignatura B2', /* ... */],
    'Arte': ['Asignatura At1', 'Asignatura At2', /* ... */],
};

const asignaturasDepartamento = asignaturas[departamento];
const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);

const handleAsignaturaClick = (asignatura) => {
    onSelectAsignatura(asignatura);
    setAsignaturaSeleccionada(asignatura);
};

return (
    <div>

    <ul>
        {asignaturasDepartamento.map((asignatura) => (
        <li
            key={asignatura}
            onClick={() => handleAsignaturaClick(asignatura)}
            className={`cursor-pointer ${asignaturaSeleccionada === asignatura ? 'bg-blue-500/90 text-white' : ''}`}
        >
            {asignatura}
        </li>
        ))}
    </ul>

    </div>
);
};

export default Asignatura;
