import React, { useState, useEffect } from 'react';
import axios from 'axios';
const VideoUploader = () => {

  const [nombreUsuario, setNombreUsuario] = useState('');
  const [video, setVideo] = useState(null);
  const [idDocente, setIdDocente] = useState(''); // Asegúrate de tener el idDocente adecuado
  const [asignaturas, setAsignaturas] = useState([]);
  const [idSeccion, setIdSeccion] = useState('');



  useEffect(() => {
    // Obtener la lista de asignaturas al montar el componente
// Recuperar nombreUsuario del almacenamiento de sesión
const usuarioGuardado = localStorage.getItem('nombreUsuario');
if (usuarioGuardado) {
    setNombreUsuario(usuarioGuardado);
}
console.error(nombreUsuario);
    const fetchAsignaturas = async () => {
      try {
         //idDocente = parseInt(nombreUsuario, 6);
        const response = await axios.get(`http://localhost:8888/api/docentes/${nombreUsuario}/clases`); // Ajusta la ruta según tu API
        setAsignaturas(response.data);
      } catch (error) {
        console.error('Error al obtener asignaturas:', error);
      }
    };

    fetchAsignaturas();
  }, [nombreUsuario]);

  const handleVideoChange = (event) => {
    setVideo(event.target.files[0]);
  };

  const handleAsignaturaChange = (event) => {
    const selectedAsignatura = asignaturas.find((asignatura) => asignatura.id_asignatura === event.target.value);

    if (selectedAsignatura) {
      setIdSeccion(selectedAsignatura.id_seccion);
    } else {
      setIdSeccion('');
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('video', video);
      formData.append('idSeccion', idSeccion);

      await axios.post('http://localhost:8888/api/videos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Manejo exitoso
      alert('Video subido exitosamente.');
    } catch (error) {
      // Manejo de errores
      console.error('Error al subir el video:', error);
      alert('Error al subir el video.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Subir Video</h2>

      <label className="block mb-4">
        <span className="text-gray-700">Seleccionar Video:</span>
        <input type="file" accept="video/*" onChange={handleVideoChange} className="mt-1" />
      </label>

      <label className="block mb-4">
        <span className="text-gray-700">Seleccionar Asignatura:</span>
        <select value={idSeccion} onChange={handleAsignaturaChange} className="mt-1 p-2">
          <option value="">Seleccionar...</option>
          {asignaturas.map((asignatura) => (
            <option key={asignatura.id_asignatura} value={asignatura.id_asignatura}>
              {asignatura.nombre_asig} - {asignatura.hora_inicio}
            </option>
          ))}
        </select>
      </label>

      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        Subir Video
      </button>
    </div>
  );
};

export default VideoUploader;
