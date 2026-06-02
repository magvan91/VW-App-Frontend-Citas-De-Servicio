export interface CitasServicioValues {
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
  aceptaAviso: boolean;
  opt_in_transferencia_datos: boolean;
  tyco: boolean;
  dates: [Date, Date] | null;
}
