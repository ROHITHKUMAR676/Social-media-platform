import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['x-auth-token'] = token;
      // Optionally fetch user profile
      // fetchUserProfile();
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['x-auth-token'] = token;
      // Fetch user data
      // const userResponse = await api.get('/users/profile');
      // setUser(userResponse.data);
      setUser({ id: 'user-id', username: credentials.email.split('@')[0] }); // Mock
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['x-auth-token'] = token;
      setUser({ id: 'user-id', username: userData.username });
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};