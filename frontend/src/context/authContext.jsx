import React, { createContext, useState, useEffect, useContext } from "react";
import { loginUserApi, getCurrentUserApi } from "../services/authService"; // Use the updated authService

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
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setError("Session expired. Please login again.");
        }
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await loginUserApi(username, password);

      // Store tokens in localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

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
  // const logout = () => {
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("refreshToken");
  //   setCurrentUser(null);
  // };

  const value = {
    currentUser,
    loading,
    error,
    login,
    // logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};