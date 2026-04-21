export interface CitasServicioValues {
  numeroChasis: string;
  anio: string;
  modelo: string;
  kilometrajeAuto: string | number;
  kilometrajeServicio: string;
  idConcesionario: string;
  estado: string;
  ciudad: string;
  dates: [Date, Date] | null;
  fecha: string;
  horario: string;
  nombre: string;
  apePat: string;
  apeMat: string;
  telefonoMovil: string;
  email: string;
  comentarios: string;
  aceptaAviso: boolean;
  opt_in_transferencia_datos: boolean;
  tyco: boolean;
  tipoServicio: number;
}
