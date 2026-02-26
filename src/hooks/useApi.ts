import { useCallback } from "react";
import api from "../services/api";
import { config } from "../config/appConfig";

export const useApi = () => {
  const get = useCallback((url: string, params?: Record<string, unknown>) => {
    return api.get(url, { params });
  }, []);

  const post = useCallback((url: string, data?: unknown) => {
    return api.post(url, data);
  }, []);

  return {
    get,
    post,
    baseURL: config.apiBaseUrl, // Exportar la URL base por si se necesita
    currentEnvironment: config.name,
  };
};
