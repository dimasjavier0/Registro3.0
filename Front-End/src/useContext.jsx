// userContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');

  const setUsuario = (usuario) => {
    setNombreUsuario(usuario);
  };

  return (
    <UserContext.Provider value={{ nombreUsuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe ser utilizado dentro de un UserProvider');
  }
  return context;
};
