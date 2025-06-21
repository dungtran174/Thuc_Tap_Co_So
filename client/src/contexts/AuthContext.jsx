import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    console.log('AuthContext - Stored user:', storedUser);
    console.log('AuthContext - Stored token:', storedToken);
    
    if (storedUser && storedToken) {
      const userData = JSON.parse(storedUser);
      console.log('AuthContext - Parsed user data:', userData);
      setUser(userData);
      setToken(storedToken);
      setIsLoggedIn(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = (userData, userToken) => {
    console.log('AuthContext - Login called with:', userData);
    setUser(userData);
    setToken(userToken);
    setIsLoggedIn(true);
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    isLoggedIn,
    isLoading,
    login,
    logout
  };

  // THAY ĐỔI NÀY - luôn render children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;