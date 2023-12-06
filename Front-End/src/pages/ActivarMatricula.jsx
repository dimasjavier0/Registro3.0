import React, { useState } from 'react';
import axios from 'axios';

const ActivarMatricula = () => {
   const [idPAC, setIdPAC] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8888/activar-matricula', { id_PAC: idPAC, descripcion });
            console.log(response.data);
            // Manejar la respuesta o mostrar un mensaje de éxito
        } catch (error) {
            console.error('Error al activar la matrícula', error);
            // Manejar el error o mostrar un mensaje
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={idPAC} onChange={(e) => setIdPAC(e.target.value)} placeholder="ID PAC" />
            <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" />
            <button type="submit">Activar Matrícula</button>
        </form>
    );
};

export default ActivarMatricula;
