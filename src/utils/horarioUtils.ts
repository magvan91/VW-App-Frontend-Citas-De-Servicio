export const formatFecha = (fecha: string): string => {
  return new Date(fecha + "T00:00:00").toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatHorario = (horario: string): string => {
  const [h, m] = horario.split(":");
  const hora = parseInt(h);
  const sufijo = hora >= 12 ? "p.m." : "a.m.";
  const hora12 = hora % 12 || 12;
  return `${hora12}:${m} ${sufijo}`;
};
