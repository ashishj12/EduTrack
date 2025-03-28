import React, { createContext, useState, useEffect, useContext } from "react";
import { 
  loginUserApi, 
  getCurrentUserApi, 
  loginFacultyApi,
  loginAdminApi 
} from "../services/authService";

// Create the context
const AuthContext = createContext();

// Custom hook for using the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to provide the context to the app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the user is already logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      
      // If token and user data are available, set the user from localStorage
      if (token && storedUser) {
        try {
          // You can optionally verify the token via API call here if needed
          setCurrentUser(storedUser);
        } catch (err) {
          // Clear all auth data on error
          clearAuthData();
          setError("Session expired. Please login again.");
        }
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  // Utility function to clear authentication data
  const clearAuthData = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    
    // Prevent browser back navigation
    window.history.pushState(null, "", "/login");
    window.location.href = "/login";
  };

  // Login function for student
  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginUserApi(username, password);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      setCurrentUser(data.user);
      setLoading(false);
      return data.user;
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
      throw err;
    }
  };

  // Login function for faculty
  const loginFaculty = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginFacultyApi(username, password);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      setCurrentUser(data.user);
      setLoading(false);
      return data.user;
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
      throw err;
    }
  };

  // Admin login function
  const loginAdmin = async (username, password, secretKey) => {
    setLoading(true);
    setError(null);
  
    try {
      const data = await loginAdminApi(username, password, secretKey);
      
      // Ensure the response contains the expected data
      if (!data.user || data.user.role !== 'Admin') {
        throw new Error('Invalid admin credentials');
      }
  
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      setCurrentUser(data.user);
      setLoading(false);
      return data.user;
    } catch (err) {
      setError(err.message || "Admin login failed");
      setLoading(false);
      throw err;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    loginFaculty,
    logout,
    loginAdmin,
    clearAuthData,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
