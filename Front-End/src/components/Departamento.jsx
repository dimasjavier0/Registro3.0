import React, { useState } from 'react';

const Departamento = ({ onSelectDepartamento }) => {
    //ejemplo departamentos
    const departamentos = ['Astronomía', 'Biología', 'Arte', /* ... */];
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState(null);

    const handleDepartamentoClick = (departamento) => {
        onSelectDepartamento(departamento);
        setDepartamentoSeleccionado(departamento);
    };

    return (
        <div>
        <ul>
            {departamentos.map((departamento) => (
            <li
                key={departamento}
                onClick={() => handleDepartamentoClick(departamento)}
                className={`cursor-pointer ${departamentoSeleccionado === departamento ? 'bg-blue-500/90 text-white' : ''}`}
            >
                {departamento}
            </li>
            ))}
        </ul>
        </div>
    );
    };

export default Departamento;
