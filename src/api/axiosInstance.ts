import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`, 
  headers: { "Content-Type": "application/json" },
});

// Optional: JWT interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;