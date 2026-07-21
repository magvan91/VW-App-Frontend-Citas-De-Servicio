import type { ServiceOption } from "../interfaces/ServiceOption.interface";
import AccesoriosIcon from "../assets/images/cotizacionAccesorios.svg";
import PinturaIcon from "../assets/images/ojalateriaPintura.svg";
import ReparacionIcon from "../assets/images/diagnosticoReparacion.svg";
import MantenimientoIcon from "../assets/images/servicioMantenimiento.svg";

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 0,
    title: "Servicio de mantenimiento",
    titleEnglish: "Maintenance Service",
    icon: MantenimientoIcon,
  },
  {
    id: 1,
    title: "Diagnóstico y reparación",
    titleEnglish: "General Repair",
    icon: ReparacionIcon,
  },
  {
    id: 2,
    title: "Hojalatería y pintura",
    titleEnglish: "Tinsmithing and Painting",
    icon: PinturaIcon,
  },
  {
    id: 3,
    title: "Cotización e instalación de accesorios",
    titleEnglish: "Accessory Installation",
    icon: AccesoriosIcon,
  },
];

export const getServiceTitleById = (id: number): string | undefined => {
  const service = SERVICE_OPTIONS.find((option) => option.id === id);
  return service?.title;
};

export const getServiceTitleEnglishById = (id: number): string | undefined => {
  const service = SERVICE_OPTIONS.find((option) => option.id === id);
  return service?.titleEnglish;
};
