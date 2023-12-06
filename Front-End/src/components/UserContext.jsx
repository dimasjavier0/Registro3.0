import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function useUserContext() {
  return useContext(UserContext);
}

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [numeroCuenta, setNumeroCuenta] = useState(null);


  const setUserContext = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const setNumeroCuentaContext = (number) => {
    setNumeroCuenta(number);
  };

  const clearUserContext = () => {
    localStorage.removeItem('userData');
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUser(userData);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUserContext, numeroCuenta, setNumeroCuentaContext, clearUserContext }}>
      {children}
    </UserContext.Provider>
  );
}
