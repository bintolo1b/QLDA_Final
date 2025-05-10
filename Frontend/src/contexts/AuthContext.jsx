import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService } from '../api';
import { useNavigate } from 'react-router-dom';

// Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (token && user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        // Clear potentially corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials);
      const { token, user } = response.data;
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Đăng nhập thất bại'
      };
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    AuthService.logout();
    
    // Update state
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // Redirect to login
    navigate('/login');
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Đăng ký thất bại'
      };
    }
  };

  // Get the current user's profile
  const fetchCurrentUser = async () => {
    try {
      const response = await AuthService.getCurrentUser();
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      if (error.response?.status === 401) {
        logout();
      }
      return null;
    }
  };

  // Value to be provided to consumers
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    fetchCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 