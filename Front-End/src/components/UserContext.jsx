// UserContext.js
import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function useUserContext() {
  return useContext(UserContext);
}

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [numeroCuenta, setNumeroCuenta] = useState(null);

  const setUserContext = (userData) => {
    setUser(userData);
  };

  const setNumeroCuentaContext = (number) => {
    setNumeroCuenta(number);
  };

  return (
    <UserContext.Provider value={{ user, setUserContext, numeroCuenta, setNumeroCuentaContext }}>
      {children}
    </UserContext.Provider>
  );
}
