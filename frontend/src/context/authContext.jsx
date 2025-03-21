import React, { createContext, useState, useEffect, useContext } from "react";
import {
  loginUserApi,
  getCurrentUserApi,
  loginFacultyApi,
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
      if (token) {
        try {
          const userData = await getCurrentUserApi();
          setCurrentUser(userData.user);
        } catch (err) {
          // Clear all auth data on error
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setError("Session expired. Please login again.");
        }
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  // Login function for student
  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginUserApi(username, password);
      // Store tokens in localStorage
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
      // Store tokens in localStorage
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

  // Logout function
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  //admin login function
  const loginAdmin = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginAdmin(username, password);
      // Store tokens in localStorage
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

  const value = {
    currentUser,
    loading,
    error,
    login,
    loginFaculty,
    logout,
    loginAdmin,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};