import axios from 'axios';

const API_URL = 'http://localhost:8888/api';

export const agregarContacto = async (estudianteId, contactoId) => {
  return await axios.post(`${API_URL}/contactos/agregar`, { estudianteId, contactoId });
};

export const enviarMensaje = async (senderId, receiverId, texto) => {
  return await axios.post(`${API_URL}/mensajes-personales/enviar`, { senderId, receiverId, texto });
};

export const crearGrupo = async (nombreGrupo, creadorId) => {
    return await axios.post(`${API_URL}/grupos/crear`, { nombreGrupo, creadorId });
  };
  
  // Función para agregar un miembro a un grupo
  export const agregarMiembroGrupo = async (grupoId, miembroId) => {
    return await axios.post(`${API_URL}/miembros-grupo/agregar`, { grupoId, miembroId });
  };
  
  // Función para enviar un mensaje en un grupo
  export const enviarMensajeGrupo = async (grupoId, remitenteId, texto) => {
    return await axios.post(`${API_URL}/mensajes-grupo/enviar`, { grupoId, remitenteId, texto });
  };
  