export const onlyLettersWithAcents = (word: string): string => {
  //* Se agrega \u00C0-\u00FF para incluir acentos y ñ
  const filteredValue = word.replace(/[^a-zA-Z\u00C0-\u00FF\s]/g, "");
  return filteredValue;
};

export const onlyLettersAndNumbers = (word: string): string => {
  const filteredValue = word.replace(/[^\p{L}\p{N}]|[ñÑ]/gu, "");
  return filteredValue;
};

export const onlyNumbers = (digit: string): string => {
  const filteredValue = digit.replace(/\D/g, "");
  return filteredValue;
};

export const formatNumberWithCommas = (value: string | number): string => {
  if (!value) return "";
  const cleanValue = value.toString().replace(/\D/g, "");
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const formatKilometraje = (value: string | number): string => {
  if (!value || value === 0 || null) return "";
  const cleanValue = value.toString().replace(/\D/g, "");
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

//Para el scroll automático en mobile al cambiar de tab
export const isMobile = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 768px)").matches;
};

export const nameFieldsRequired = [
  [
    "tipoServicio",
    "numeroChasis",
    "anio",
    "modelo",
    "kilometrajeAuto",
    "kilometrajeServicio",
  ],
  ["estado", "ciudad", "idConcesionario", "horario"],
  ["nombre", "apePat", "apeMat", "telefonoMovil"],
];
