import React, { createContext, useContext, useState } from 'react';
import { INITIAL_CREDENTIALS } from '../data/initialData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [credentials, setCredentials] = useState(INITIAL_CREDENTIALS);
  const [currentUser, setCurrentUser] = useState(INITIAL_CREDENTIALS[0]); // default logged in as Super Admin for preview, or null

  const login = (email, password) => {
    const user = credentials.find(
      c => c.email.toLowerCase() === email.toLowerCase().trim() && c.pass === password.trim()
    );
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, error: 'Invalid credentials. Please check your email and password.' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchDemoRole = (role) => {
    const target = credentials.find(c => c.role === role);
    if (target) {
      setCurrentUser(target);
    }
  };

  const addCredential = (newCred) => {
    setCredentials(prev => [...prev, newCred]);
  };

  const value = {
    currentUser,
    isLoggedIn: !!currentUser,
    role: currentUser?.role || null,
    entityId: currentUser?.entityId || null,
    isAdmin: currentUser?.role === 'ADMIN',
    isOrg: currentUser?.role === 'ORG',
    isSubOrg: currentUser?.role === 'SUBORG',
    login,
    logout,
    switchDemoRole,
    addCredential
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
