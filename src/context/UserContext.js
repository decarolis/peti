import React, { createContext } from 'react';

import useAuth from '../hooks/useAuth';

const Context = createContext();

function UserProvider({ children }) {
  const { authenticated, loading, login, logout, userName } = useAuth();

  return (
    <Context.Provider
      value={{ loading, authenticated, login, logout, userName }}
    >
      {children}
    </Context.Provider>
  );
}

export { Context, UserProvider };
