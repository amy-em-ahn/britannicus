import { createContext, useContext, useState, useEffect } from 'react';
import { login, logout, onUserStateChange } from '../api/firebase';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  // check login user
  const [user, setUser] = useState();

  useEffect(() => {
    onUserStateChange((user) => {
      console.log('setUser:', user);
      setUser(user);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, uid: user && user.uid, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
