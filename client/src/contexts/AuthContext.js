import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Создаем axios instance с базовым URL
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success(
        userData.language === 'lv' 
          ? 'Pieteikšanās veiksmīga!' 
          : 'Login successful!'
      );
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 
        (user?.language === 'lv' ? 'Pieteikšanās neizdevās' : 'Login failed');
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    
    toast.success(
      user?.language === 'lv' 
        ? 'Izrakstīšanās veiksmīga!' 
        : 'Logout successful!'
    );
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/me', profileData);
      setUser(response.data.user);
      
      toast.success(
        user?.language === 'lv' 
          ? 'Profils atjaunināts!' 
          : 'Profile updated!'
      );
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 
        (user?.language === 'lv' ? 'Profila atjaunināšana neizdevās' : 'Profile update failed');
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      
      toast.success(
        user?.language === 'lv' 
          ? 'Parole nomainīta!' 
          : 'Password changed!'
      );
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 
        (user?.language === 'lv' ? 'Paroles maiņa neizdevās' : 'Password change failed');
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Check if user has specific role
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  // Check if user is admin
  const isAdmin = () => hasRole(['admin', 'superadmin']);

  // Check if user is superadmin
  const isSuperAdmin = () => hasRole('superadmin');

  const value = {
    user,
    loading,
    token,
    login,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    isAdmin,
    isSuperAdmin,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
