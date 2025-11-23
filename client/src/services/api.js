import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000", // API Gateway
  headers: {
    "Content-Type": "application/json",
  },
});

// Tự gắn token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
