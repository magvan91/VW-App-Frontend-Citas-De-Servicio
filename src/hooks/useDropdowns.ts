// ./hooks/useDropdowns.ts
import { useState, useEffect, useMemo } from "react";
import { useApi } from "./useApi";
import { getServiceTitleEnglishById } from "../utils/serviceOptions";

export interface LocationItem {
  id: number;
  name: string;
}
export interface DealerItem {
  idConcesionario: string;
  name: string;
}

export const useDropdowns = (
  estadoId: number,
  ciudadId: number,
  typeService: number,
) => {
  const nameTitleService = useMemo(
    () => getServiceTitleEnglishById(typeService),
    [typeService],
  );
  const { get } = useApi();

  const [estados, setEstados] = useState<LocationItem[]>([]);
  const [ciudadesState, setCiudadesState] = useState<{
    estadoId: number;
    items: LocationItem[];
  }>({ estadoId: 0, items: [] });
  const [concesionariosState, setConcesionariosState] = useState<{
    ciudadId: number;
    items: DealerItem[];
  }>({ ciudadId: 0, items: [] });

  // Efecto 1: Cargar Estados al inicio
  useEffect(() => {
    if (nameTitleService === "undefined" || !nameTitleService) {
      return;
    }
    const fetchEstados = async () => {
      try {
        const response = await get(`/api/v1/states`, {
          params: {
            service_type: nameTitleService,
          },
        });
        setEstados(response.data || []);
      } catch (error) {
        console.error("Error al cargar estados:", error);
      }
    };
    fetchEstados();
  }, [nameTitleService, get]);

  // Efecto 2: Cargar Ciudades cuando cambia el Estado
  useEffect(() => {
    if (isNaN(estadoId) || nameTitleService === "undefined") {
      return;
    }
    const fetchCiudades = async () => {
      try {
        const response = await get(
          `/api/v1/states/${estadoId}/cities?service_type=${nameTitleService}`,
        );
        setCiudadesState({ estadoId, items: response.data || [] });
      } catch (error) {
        console.error("Error al cargar ciudades:", error);
      }
    };
    fetchCiudades();
  }, [estadoId, nameTitleService, get]);

  // Efecto 3: Cargar Concesionarios cuando cambia la Ciudad
  useEffect(() => {
    if (isNaN(ciudadId) || nameTitleService === "undefined") {
      return;
    }
    const fetchDealers = async () => {
      try {
        const response = await get(`/api/v1/cities/${ciudadId}/dealers`, {
          params: {
            service_type: nameTitleService,
          },
        });
        setConcesionariosState({ ciudadId, items: response.data || [] });
      } catch (error) {
        console.error("Error al cargar concesionarios:", error);
      }
    };
    fetchDealers();
  }, [ciudadId, nameTitleService, get]);

  // Retornamos los arreglos para que el formulario los consuma
  return {
    estados,
    ciudades: ciudadesState.estadoId === estadoId ? ciudadesState.items : [],
    concesionarios:
      concesionariosState.ciudadId === ciudadId
        ? concesionariosState.items
        : [],
  };
};
