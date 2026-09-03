/* =========================================================
   PASO 2.7 · BITÁCORA DE USO DE IA
   Traducción de formatProblemLogDate()
   ========================================================= */

export function formatProblemLogDate(value) {
  if (!value) {
    return "Fecha no registrada";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function etiquetaConteoRegistros(total) {
  return total + (total === 1 ? " registro" : " registros");
}
