// ./hooks/useDropdowns.ts
import { useState, useEffect, useMemo } from "react";
import { useApi } from "./useApi";
import { getServiceTitleEnglishById } from "../utils/serviceOptions";

export interface LocationItem {
  id: number;
  name: string;
}
export interface DealerItem {
  id: string;
  name: string;
}

export interface ResponseGetDelaer {
  id: number;
  name: string;
  address: string;
  map_url: string;
  city_id: number;
  services: string[];
}
export const useDropdowns = (
  estadoId: number,
  ciudadId: number,
  dealerId: number,
  typeService: number,
) => {
  const nameTitleService = useMemo(
    () => getServiceTitleEnglishById(typeService),
    [typeService],
  );
  const { get } = useApi();

  const [estados, setEstados] = useState<LocationItem[]>([]);
  const [loadingEstados, setLoadingEstados] = useState<boolean>(false);

  const [ciudadesState, setCiudadesState] = useState<{
    estadoId: number;
    items: LocationItem[];
  }>({ estadoId: 0, items: [] });
  const [loadingCiudades, setLoadingCiudades] = useState<boolean>(false);

  const [concesionariosState, setConcesionariosState] = useState<{
    ciudadId: number;
    items: DealerItem[];
  }>({ ciudadId: 0, items: [] });
  const [loadingConcesionarios, setLoadingConcesionarios] =
    useState<boolean>(false);

  const [dealer, setDealer] = useState<ResponseGetDelaer | null>();

  //* Efecto 1: Cargar Estados al inicio
  useEffect(() => {
    if (nameTitleService === "undefined" || !nameTitleService) {
      return;
    }
    const fetchEstados = async () => {
      setLoadingEstados(true);
      try {
        const response = await get(`states?service_type=${nameTitleService}`);
        setEstados(response.data || []);
      } catch (error) {
        console.error("Error al cargar estados:", error);
      } finally {
        setLoadingEstados(false);
      }
    };
    fetchEstados();
    return () => {
      setEstados([]);
    };
  }, [nameTitleService, get]);

  //* Efecto 2: Cargar Ciudades cuando cambia el Estado
  useEffect(() => {
    if (isNaN(estadoId) || nameTitleService === "undefined") {
      return;
    }
    const fetchCiudades = async () => {
      setLoadingCiudades(true);
      try {
        const response = await get(
          `states/${estadoId}/cities?service_type=${nameTitleService}`,
        );
        setCiudadesState({ estadoId, items: response.data || [] });
      } catch (error) {
        console.error("Error al cargar ciudades:", error);
      } finally {
        setLoadingCiudades(false);
      }
    };
    fetchCiudades();
    return () => {
      setCiudadesState({ estadoId: 0, items: [] });
    };
  }, [estadoId, nameTitleService, get]);

  //* Efecto 3: Cargar Concesionarios cuando cambia la Ciudad
  useEffect(() => {
    if (isNaN(ciudadId) || nameTitleService === "undefined") {
      return;
    }
    const fetchDealers = async () => {
      setLoadingConcesionarios(true);
      try {
        const response = await get(
          `cities/${ciudadId}/dealers?service_type=${nameTitleService}`,
        );
        setConcesionariosState({ ciudadId, items: response.data || [] });
      } catch (error) {
        console.error("Error al cargar concesionarios:", error);
      } finally {
        setLoadingConcesionarios(false);
      }
    };
    fetchDealers();
    return () => {
      setConcesionariosState({ ciudadId: 0, items: [] });
    };
  }, [ciudadId, nameTitleService, get]);

  //* Obtener la información del concesionario seleccionado
  useEffect(() => {
    if (isNaN(dealerId) || nameTitleService === "undefined") {
      return;
    }
    const fetchDealer = async () => {
      try {
        const response = await get(`dealers/${dealerId}`);
        setDealer(response.data);
      } catch (error) {
        console.error("Error al cargar concesionarios:", error);
      }
    };
    fetchDealer();
    return () => {
      setDealer(null);
    };
  }, [dealerId, nameTitleService, get]);

  return {
    estados,
    loadingEstados,
    ciudades: ciudadesState.estadoId === estadoId ? ciudadesState.items : [],
    loadingCiudades,
    concesionarios:
      concesionariosState.ciudadId === ciudadId
        ? concesionariosState.items
        : [],
    loadingConcesionarios,
    dealer,
  };
};
