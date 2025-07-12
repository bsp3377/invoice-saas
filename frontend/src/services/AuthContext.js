import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock authentication for demo purposes
  async function signUp(email, password, companyName) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data locally for demo
      const userData = {
        email,
        companyName,
        id: Date.now().toString()
      };
      
      localStorage.setItem('demoUser', JSON.stringify(userData));
      setUser(userData);
      
      return { user: userData };
    } catch (error) {
      throw new Error('Signup failed');
    }
  }

  async function signIn(email, password) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage
      const storedUser = localStorage.getItem('demoUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.email === email) {
          setUser(userData);
          return userData;
        }
      }
      
      // Create demo user if doesn't exist
      const userData = {
        email,
        companyName: 'Demo Company',
        id: Date.now().toString()
      };
      
      localStorage.setItem('demoUser', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async function signOut() {
    try {
      localStorage.removeItem('demoUser');
      setUser(null);
    } catch (error) {
      throw error;
    }
  }

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('demoUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}