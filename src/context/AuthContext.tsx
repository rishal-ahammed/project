import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock admin credentials (in a real app, this would be handled securely in a backend)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('username');
  });
  
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [isAuthenticated, username]);
  
  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate async login request
    return new Promise((resolve) => {
      setTimeout(() => {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          setIsAuthenticated(true);
          setUsername(username);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
  };
  
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};