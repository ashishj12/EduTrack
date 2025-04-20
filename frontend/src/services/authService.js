import getBaseUrl from "../utils/baseUrl";
const API_URL = `${getBaseUrl()}/api`;


// Helper function for handling API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

// Login Student
export const loginUserApi = async (username, password) => {
  const response = await fetch(`${API_URL}/student/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
};

// Get current student
export const getCurrentUserApi = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No authentication token");
  }

  const response = await fetch(`${API_URL}/student/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

// Login faculty
export const loginFacultyApi = async (username, password) => {
  const response = await fetch(`${API_URL}/faculty/login-faculty`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
};

// Get current faculty
export const getCurrentFacultyApi = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No authentication token");
  }

  const response = await fetch(`${API_URL}/faculty/get-faculty`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};

// Login admin
export const loginAdminApi = async (username, password, secretKey) => {
  const response = await fetch(`${API_URL}/admin/admin-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, secretKey }), 
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred");
  }

  return response.json(); 
};

// Admin register student
export const registerStudentApi = async (studentData) => {
  const token = localStorage.getItem("accessToken");

  // Ensure a valid token exists
  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await fetch(`${API_URL}/admin/register-student`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    return await handleResponse(response); 
  } catch (error) {
    console.error("Error registering student:", error);
    throw error;
  }
};


//admin register faculty
export const registerFacultyApi = async (facultyData) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await fetch(`${API_URL}/admin/register-faculty`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(facultyData),
    });
    return await handleResponse(response); 
  } catch (error) {
    console.error("Error registering faculty:", error);
    throw error; 
  }
}

//admin register subject to faculty
export const assignSubjectToFacultyApi = async (subjectName, subjectSem,facultyId) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await fetch(`${API_URL}/admin/assign-subject`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subjectName, subjectSem,facultyId }),
    });
    return await handleResponse(response); 
  } catch (error) {
    console.error("Error assigning subject to faculty:", error);
    throw error; 
  }
}

export const getAllFacultiesApi = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found.");
    }
    
    const response = await fetch(`${API_URL}/faculty/all-faculties`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error("Error in getAllFacultiesApi:", error);
    throw error;
  }
};


export const getAllStudentsApi = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found.");
    }
    
    const response = await fetch(`${API_URL}/student/all-students`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};


//get assigned subjects to faculty
export const getAssignedSubjectsApi = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found.");
    }
    
    const response = await fetch(`${API_URL}/faculty/assigned-subjects`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching assigned subjects:", error);
    throw error;
  }
}

// Mark attendance using image recognition
export const markAttendanceApi = async (formData) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found.");
    }
    
    const response = await fetch(`${API_URL}/attendance/mark-attendance`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Don't set Content-Type when sending FormData
      },
      body: formData, // Send as FormData for file upload
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error("Error marking attendance:", error);
    throw error;
  }
};

// Get recent attendance records
export const getRecentAttendanceApi = async (limit = 5) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found.");
    }
    
    const response = await fetch(`${API_URL}/attendance/all-attendance?limit=${limit}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching recent attendance:", error);
    throw error;
  }
};

// Get student attendance records
export const getStudentAttendanceApi = async (filters = {}) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("No authentication token found.");
      return []; 
    }
    
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters.subject) queryParams.append('subject', filters.subject);
    if (filters.semester) queryParams.append('semester', filters.semester);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    
    const url = `${API_URL}/attendance/get-student/records?${queryParams.toString()}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      return []; 
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    return []; 
  }
};

// Submit a correction request
export const submitCorrectionRequestApi = async (correctionData) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found.");
    }
    
    const response = await fetch(`${API_URL}/student/correction`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(correctionData),
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error("Error submitting correction request:", error);
    throw error;
  }
};


// Get all correction requests (for admin)
export const getAllCorrectionsApi = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found.");
    }
    
    const response = await fetch(`${API_URL}/admin/corrections`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error("Error fetching correction requests:", error);
    throw error;
  }
};