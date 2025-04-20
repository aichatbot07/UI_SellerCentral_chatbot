// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Backend URL

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.success) {
      return response.data; // Response containing user info and token
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const signupUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, credentials);
    if (response.data.success) {
      return response.data; // Response containing user info
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

