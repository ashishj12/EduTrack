import React, { createContext, useState, useEffect, useContext } from "react";
import { 
  loginUserApi, 
  loginFacultyApi,
  loginAdminApi,
  registerStudentApi,
  getAllStudentsApi,
  getAssignedSubjectsApi,
  getAllFacultiesApi,
  registerFacultyApi,
  assignSubjectToFacultyApi,
  markAttendanceApi,
  getRecentAttendanceApi,
  getStudentAttendanceApi,
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

  //get all students
  const getAllStudents = async () => {
    try {
      const response = await getAllStudentsApi();
      console.log('All Students:', response); // Log the response for debugging
      return response; 
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(err.message || "Failed to fetch students");
      throw err; // Rethrow the error to be caught in the StudentManagement component
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

  //get all faculties
  const getAllFaculties = async () => {
    try {
      const response = await getAllFacultiesApi();
      return response; 
    } catch (err) {
      console.error("Error fetching faculties:", err);
      setError(err.message || "Failed to fetch faculties");
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

  // Admin register student function
  const adminRegisterStudent = async (username, password, name, branch, batch, semester) => {
    setLoading(true);
    setError(null);

    try {
      const studentData = { 
        username, 
        password, 
        name,  
        branch, 
        semester, 
        batch 
      };
      
      const data = await registerStudentApi(studentData);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Student registration failed");
      setLoading(false);
      throw err;
    }
  };

  // add faculty registration function here
  const adminRegisterFaculty = async (username, password, name, department, subjects) => {
    setLoading(true);
    setError(null);

    try {
      const facultyData = { username, password, name, department, subjects };
      const data = await registerFacultyApi(facultyData);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Faculty registration failed");
      setLoading(false);
      throw err;
    }
  }

  //assign subject to faculty
  const assignSubjectToFaculty = async (subjectName, subjectSem, facultyId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await assignSubjectToFacultyApi(subjectName, subjectSem, facultyId);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Subject assignment failed");
      setLoading(false);
      throw err;
    }
  }

  //get assigned subjects to faculty
  const getAssignedSubjects = async () => {
    try {
      const response = await getAssignedSubjectsApi();
      return response; 
    } catch (err) {
      console.error("Error fetching assigned subjects:", err);
      setError(err.message || "Failed to fetch assigned subjects");
      throw err;
    }
  }

  // Mark attendance using image recognition
  const markAttendance = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // Log FormData fields for debugging (optional)
      // Note: FormData contents can't be directly logged
      console.log("Submitting attendance...");

      const data = await markAttendanceApi(formData);
      console.log("Attendance API response:", data);
      setLoading(false);
      return data;
    } catch (err) {
      console.error("Error marking attendance:", err);
      setError(err.message || "Failed to mark attendance");
      setLoading(false);
      throw err;
    }
  }

  // Get recent attendance records
  const getRecentAttendance = async (limit = 5) => {
    try {
      console.log("Fetching recent attendance records...");
      const response = await getRecentAttendanceApi(limit);
      console.log("Recent attendance API response:", response);
      return response;
    } catch (err) {
      console.error("Error fetching recent attendance:", err);
      setError(err.message || "Failed to fetch recent attendance records");
      throw err;
    }
  }

  // Get student attendance records
  const getStudentAttendance = async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getStudentAttendanceApi(filters);
      setLoading(false);
      return response;
    } catch (err) {
      console.error("Error fetching student attendance:", err);
      setError(err.message || "Failed to fetch attendance records");
      setLoading(false);
      throw err;
    }
  };
  
  const value = {
    currentUser,
    loading,
    error,
    login,
    getAllStudents,
    loginFaculty,
    getAllFaculties,
    logout,
    loginAdmin,
    clearAuthData,
    adminRegisterFaculty,
    getAssignedSubjects,
    adminRegisterStudent,
    assignSubjectToFaculty,
    markAttendance,
    getRecentAttendance,
    getStudentAttendance,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};