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

// Login user
export const loginUserApi = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
};

// Get current user
export const getCurrentUserApi = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No authentication token");
  }

  const response = await fetch(`${API_URL}/auth/me`, {
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
  const response = await fetch(`${API_URL}/auth/login-faculty`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(response);
};

// Get current user
export const getCurrentFacultyApi = async () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No authentication token");
  }

  const response = await fetch(`${API_URL}/auth/faculty`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return handleResponse(response);
};



export const loginAdminApi = async (username, password, secretKey) => {
  const response = await fetch(`${API_URL}/auth/admin-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, secretKey }), // Ensure secretKey is in the request body
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred");
  }

  return response.json(); // Return the response JSON if successful
};

