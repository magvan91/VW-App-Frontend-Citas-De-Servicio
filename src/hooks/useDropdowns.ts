// ./hooks/useDropdowns.ts
import { useState, useEffect } from "react";
import { useApi } from "./useApi";

export interface LocationItem {
  id: string;
  name: string;
}

export interface DealerItem {
  idConcesionario: string;
  name: string;
}

export const useDropdowns = (estadoId: string, ciudadId: string) => {
  const { get } = useApi();

  const [estados, setEstados] = useState<LocationItem[]>([]);
  const [ciudades, setCiudades] = useState<LocationItem[]>([]);
  const [concesionarios, setConcesionarios] = useState<DealerItem[]>([]);

  // Efecto 1: Cargar Estados al inicio
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await get("/api/v1/states");
        setEstados(response.data || []);
      } catch (error) {
        console.error("Error al cargar estados:", error);
      }
    };
    fetchEstados();
  }, [get]);

  // Efecto 2: Cargar Ciudades cuando cambia el Estado
  useEffect(() => {
    if (!estadoId) {
      setCiudades([]);
      return;
    }
    const fetchCiudades = async () => {
      try {
        const response = await get(`/api/v1/states/${estadoId}/cities`);
        setCiudades(response.data || []);
      } catch (error) {
        console.error("Error al cargar ciudades:", error);
      }
    };
    fetchCiudades();
  }, [estadoId, get]);

  // Efecto 3: Cargar Concesionarios cuando cambia la Ciudad
  useEffect(() => {
    if (!ciudadId) {
      setConcesionarios([]);
      return;
    }
    const fetchDealers = async () => {
      try {
        const response = await get(`/api/v1/cities/${ciudadId}/dealers`);
        setConcesionarios(response.data || []);
      } catch (error) {
        console.error("Error al cargar concesionarios:", error);
      }
    };
    fetchDealers();
  }, [ciudadId, get]);

  // Retornamos los arreglos para que el formulario los consuma
  return {
    estados,
    ciudades,
    concesionarios,
  };
};
