import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAdminToken, clearAdminToken } from '../services/api.js';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => getAdminToken());
  const [username, setUsername] = useState(() => {
    return window.sessionStorage.getItem('lavender_admin_username') || 'lavendershelladmin';
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLogoutEvent = () => {
      setToken(null);
      window.sessionStorage.removeItem('lavender_admin_username');
    };

    window.addEventListener('lavender-admin-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('lavender-admin-logout', handleLogoutEvent);
    };
  }, []);

  const login = async (user, pass) => {
    setLoading(true);
    try {
      const data = await api.login(user, pass);
      setToken(data.access_token);
      setUsername(data.username || user);
      window.sessionStorage.setItem('lavender_admin_username', data.username || user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "Invalid credentials" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAdminToken();
    setToken(null);
    window.sessionStorage.removeItem('lavender_admin_username');
  };

  const isAuthenticated = Boolean(token);

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        token,
        username,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
