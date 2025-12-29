// src/api.js
import axios from "axios";

const api = axios.create({
  // Sửa fallback thành "/api"
  baseURL: import.meta.env.VITE_API_URL || "/api",
});
// Tự động gắn token nếu có trong localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;



