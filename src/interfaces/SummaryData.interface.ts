export interface SummaryData {
  numeroChasis: string;
  anio: string;
  modelo: string;
  kilometrajeAuto: string | number;
  kilometrajeServicio: string;
  idConcesionario: string;
  estado: string;
  ciudad: string;
  fecha: string;
  horario: string;
  nombre: string;
  apePat: string;
  apeMat: string;
  telefonoMovil: string;
  email: string;
  comentarios: string;
}

export interface SummarySection {
  title: string;
  data: { label: string; value: string }[];
}

export const summarySections: SummarySection[] = [
  {
    title: "Datos del Vehículo",
    data: [
      { label: "Número de Chasis", value: "numeroChasis" },
      { label: "Año", value: "anio" },
      { label: "Modelo", value: "modelo" },
      { label: "Kilometraje", value: "kilometrajeAuto" },
      { label: "Kilometraje del Servicio", value: "kilometrajeServicio" },
    ],
  },
  {
    title: "Concesionario",
    data: [
      { label: "ID Concesionario", value: "idConcesionario" },
      { label: "Estado", value: "estado" },
      { label: "Ciudad", value: "ciudad" },
    ],
  },
  {
    title: "Cita de Servicio",
    data: [
      { label: "Fecha", value: "fecha" },
      { label: "Horario", value: "horario" },
    ],
  },
  {
    title: "Datos del Cliente",
    data: [
      { label: "Nombre", value: "nombre" },
      { label: "Apellido Paterno", value: "apePat" },
      { label: "Apellido Materno", value: "apeMat" },
      { label: "Teléfono Móvil", value: "telefonoMovil" },
      { label: "Email", value: "email" },
      { label: "Comentarios", value: "comentarios" },
    ],
  },
];
