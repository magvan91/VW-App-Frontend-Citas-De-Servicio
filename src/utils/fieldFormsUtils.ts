export const onlyLettersWithAcents = (word: string): string => {
  // El modificador 'u' es vital para que \p{L} funcione correctamente
  return word.replace(/[^\p{L}\s]/gu, "");
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
  ["estado", "ciudad", "dealer_id", "horario"],
  ["nombre", "apePat", "apeMat", "telefonoMovil"],
];
