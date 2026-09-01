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

  const [ciudadesState, setCiudadesState] = useState<{
    estadoId: number;
    items: LocationItem[];
  }>({ estadoId: 0, items: [] });

  const [concesionariosState, setConcesionariosState] = useState<{
    ciudadId: number;
    items: DealerItem[];
  }>({ ciudadId: 0, items: [] });

  const [dealer, setDealer] = useState<ResponseGetDelaer | null>();

  //* Efecto 1: Cargar Estados al inicio
  useEffect(() => {
    if (nameTitleService === "undefined" || !nameTitleService) {
      return;
    }
    const fetchEstados = async () => {
      try {
        const response = await get(
          `/api/v1/states?service_type=${nameTitleService}`,
        );
        setEstados(response.data || []);
      } catch (error) {
        console.error("Error al cargar estados:", error);
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
      try {
        const response = await get(
          `/api/v1/cities/${ciudadId}/dealers?service_type=${nameTitleService}`,
        );
        setConcesionariosState({ ciudadId, items: response.data || [] });
      } catch (error) {
        console.error("Error al cargar concesionarios:", error);
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
        const response = await get(`/api/v1/dealers/${dealerId}`);
        console.log("Dealer data:", response.data);
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

  //* Retornamos los arreglos para que el formulario los consuma
  return {
    estados,
    ciudades: ciudadesState.estadoId === estadoId ? ciudadesState.items : [],
    concesionarios:
      concesionariosState.ciudadId === ciudadId
        ? concesionariosState.items
        : [],
    dealer,
  };
};
