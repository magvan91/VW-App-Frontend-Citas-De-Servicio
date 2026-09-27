import { useState, useEffect } from "react";
import { useApi } from "./useApi";

export const useHorariosDisponibles = (
  dealerId: number | string,
  dates: [Date, Date] | null, // Coincide con CitasServicioValues.interface.ts
  tipoServicioKey: number | string,
) => {
  const { post } = useApi();

  const [availableDates, setAvailableDates] = useState<
    Record<string, string[]>
  >({});
  const [loadingHorarios, setLoadingHorarios] = useState(false);
  const [error502Msg, setError502Msg] = useState("");
  const [warningMsg, setWarningMsg] = useState("");
  const [requestUuid, setRequestUuid] = useState("");
  const [dataSource, setDataSource] = useState("");

  useEffect(() => {
    if (
      !dealerId ||
      !dates ||
      dates.length < 2 ||
      tipoServicioKey === undefined ||
      tipoServicioKey === ""
    ) {
      setAvailableDates({});
      return;
    }

    const fetchSchedules = async () => {
      setLoadingHorarios(true);
      setError502Msg("");
      setWarningMsg("");
      setDataSource("");

      try {
        const servicioMap: { [key: number]: string } = {
          0: "Maintenance Service",
          1: "General Repair",
          2: "Tinsmithing and Painting",
          3: "Accessories Installation",
        };
        const tipoServicioStr =
          typeof tipoServicioKey === "string"
            ? servicioMap[parseInt(tipoServicioKey, 10)]
            : servicioMap[tipoServicioKey];

        // Conversión correcta de Date -> "YYYY-MM-DD" (antes fallaba con .split en un Date)
        const fechaInicial = dates[0].toISOString().split("T")[0];
        const fechaFinal = dates[1].toISOString().split("T")[0];

        const payload = {
          dealer_id: parseInt(String(dealerId), 10),
          fechaInicial,
          fechaFinal,
          tipoServicio: tipoServicioStr || "General Repair",
        };

        const response = await post("/schedules/availability", payload);
        const data = response.data;

        setAvailableDates(data.dates || {});
        setRequestUuid(data.request_uuid || "");
        setDataSource(data.source || "");

        if (data.fallback && data.warning) {
          setWarningMsg(data.warning);
        }
      } catch (error: unknown) {
        console.error("Error al obtener horarios:", error);

        const response = (
          error as {
            response?: {
              status?: number;
              data?: { detail?: { code?: string } };
            };
          }
        ).response;

        if (
          response?.status === 502 &&
          response.data?.detail?.code === "CONCI-01"
        ) {
          setError502Msg(
            "Por el momento el distribuidor no cuenta con servicio. Te invitamos a escoger otro distribuidor.",
          );
        } else {
          setError502Msg(
            "Ocurrió un error al cargar los horarios. Inténtalo más tarde.",
          );
        }
        setAvailableDates({});
      } finally {
        setLoadingHorarios(false);
      }
    };

    fetchSchedules();
  }, [dealerId, dates, tipoServicioKey, post]);

  return {
    availableDates,
    loadingHorarios,
    error502Msg,
    warningMsg,
    requestUuid,
    dataSource,
  };
};
