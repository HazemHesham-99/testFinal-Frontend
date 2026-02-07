import axios from "axios";

export const api = axios.create({
    baseURL:import.meta.env.VITE_BACKEND_BASE
})

api.interceptors.request.use(
  (config) => {
    // Add an Authorization header to all requests
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Must return the config object
  },
  (error) => {
    return Promise.reject(error);
  }
);