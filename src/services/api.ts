import axios from "axios";
import { config } from "../config/appConfig";

// Crear instancia de axios con la configuración
const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requests
api.interceptors.request.use(
  (config) => {
    // Log solo en desarrollo
    // if (import.meta.env.DEV) {
    //   console.log(`🔄 API Call: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    // }

    // Agregar token de autenticación si existe
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo centralizado de errores
    if (error.response?.status === 401) {
      // Redirigir a login si no está autorizado
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
