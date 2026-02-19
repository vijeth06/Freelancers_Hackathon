import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.auth.getProfile();
      setUser(response.data.data);
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = useCallback(async ({ email, password, name }) => {
    setError(null);
    try {
      const response = await api.auth.register({ email, password, name });
      const { user: userData, accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    try {
      const response = await api.auth.login({ email, password });
      const { user: userData, accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.auth.logout(refreshToken);
      }
    } catch (err) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    clearError,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
