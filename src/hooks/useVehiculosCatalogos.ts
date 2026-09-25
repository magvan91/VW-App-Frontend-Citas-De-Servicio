import { useState, useEffect } from "react";
import { useApi } from "./useApi"; // Tu hook existente

export const useVehiculosCatalogos = (selectedYear: string | number) => {
  const { get } = useApi();

  const [years, setYears] = useState<string[]>([]);
  const [vehicles, setVehicles] = useState<string[]>([]);

  const [loadingYears, setLoadingYears] = useState<boolean>(false);
  const [loadingVehicles, setLoadingVehicles] = useState<boolean>(false);

  // 1. Cargar Años al montar el componente
  useEffect(() => {
    const fetchYears = async () => {
      setLoadingYears(true);
      try {
        const response = await get("vehicles/years");

        // Transformamos el arreglo de objetos [{id: 1, year: 2026}, ...] a un arreglo estricto de strings ["2026", ...]
        const arrayDeAnios = response.data.map(
          (item: { id: string | number; year: string | number }) =>
            String(item.year),
        );

        setYears(arrayDeAnios || []);
      } catch (error) {
        console.error("Error al cargar los años:", error);
      } finally {
        setLoadingYears(false);
      }
    };
    fetchYears();
  }, [get]);

  // 2. Cargar Vehículos/Modelos en cascada cuando cambia el año seleccionado
  useEffect(() => {
    if (!selectedYear) {
      setVehicles([]);
      return;
    }

    const fetchVehiclesByYear = async () => {
      setLoadingVehicles(true);
      try {
        const response = await get(`vehicles/models?year=${selectedYear}`);

        // 1. INSPECCIÓN CLAVE: Imprime la respuesta cruda para ver qué llaves envía realmente el backend
        console.log("Respuesta cruda de modelos:", response.data);

        // 2. MAPEO DEFENSIVO
        const arrayDeVehiculos = response.data.map((item: unknown) => {
          if (typeof item === "object" && item !== null) {
            const vehicle = item as Record<string, unknown>;
            // Sustituye 'model', 'description' o 'nombre' por la llave exacta que veas en tu console.log.
            // Si no encuentra ninguna, devolverá un texto de advertencia en lugar de 'undefined' para evitar que React colapse.
            const valorExtraido =
              vehicle.model ||
              vehicle.description ||
              vehicle.name ||
              vehicle.modelo;
            return valorExtraido
              ? String(valorExtraido)
              : "Propiedad desconocida";
          }
          return String(item);
        });

        // 3. MEJOR PRÁCTICA (Edge Case): Eliminar posibles duplicados
        // A veces las APIs devuelven distintas versiones del mismo modelo con diferentes IDs.
        // Como solo enviamos el nombre en texto plano, usamos Set para garantizar opciones únicas en el dropdown.
        const vehiculosUnicos = Array.from(new Set(arrayDeVehiculos));

        setVehicles(vehiculosUnicos as string[]);
      } catch (error) {
        console.error("Error al cargar los vehículos:", error);
        setVehicles([]);
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchVehiclesByYear();
  }, [get, selectedYear]);

  return {
    years,
    vehicles,
    loadingYears,
    loadingVehicles,
  };
};
