export interface SummaryData {
  nombre: string;
  apePat: string;
  apeMat: string;
  numeroChasis: string;
  fecha: string;
  horario: string;
  telefonoMovil: string;
  email: string;
  estado: string;
  ciudad: string;
  idConcesionario: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometrajeAuto: number;
  kilometrajeServicio: number;
  tipoServicio: string;
  comentarios: string;
  servicioNombreMostrar?: string;
}

export interface SummarySection {
  title: string;
  data: { label: string; value: string }[];
}

export const summarySections: SummarySection[] = [
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
  {
    title: "Datos del Vehículo",
    data: [
      { label: "Número de Chasis", value: "numeroChasis" },
      { label: "Marca", value: "marca" },
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
      { label: "Tipo de Servicio", value: "tipoServicio" },
    ],
  },
];
