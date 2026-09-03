/* =========================================================
   EXPORTAR / IMPORTAR ESTADO EN JSON
   Traducción de exportStateJSON() e importStateJSON()
   ========================================================= */

/* Traducción de exportStateJSON() */
export function exportStateJSON(caso) {
  const json = JSON.stringify(caso, null, 2);

  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "estado_MML.json";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/*
 * Traducción de la validación y normalización que el original
 * aplicaba tras el `JSON.parse` dentro del listener de
 * `inputImportJSON` ("change").
 *
 * Lanza un Error con el mismo mensaje que mostraba el alert()
 * original cuando la estructura mínima no es válida.
 */
export function parseImportedState(rawText) {
  const importedState = JSON.parse(rawText);

  if (!importedState || typeof importedState !== "object") {
    throw new Error("El archivo no contiene un objeto JSON válido.");
  }

  if (!importedState.caso) {
    throw new Error("El JSON no contiene la sección 'caso'.");
  }

  if (!Array.isArray(importedState.involucrados)) {
    throw new Error("El JSON no contiene una lista válida de involucrados.");
  }

  if (!Array.isArray(importedState.nodos)) {
    throw new Error("El JSON no contiene una lista válida de nodos.");
  }

  /*
   * Asegurar estructuras utilizadas por el artefacto,
   * igual que el original tras validar la estructura mínima.
   */
  if (!Array.isArray(importedState.objetivos)) {
    importedState.objetivos = [];
  }

  if (!Array.isArray(importedState.acciones)) {
    importedState.acciones = [];
  }

  if (!Array.isArray(importedState.alternativas)) {
    importedState.alternativas = [];
  }

  if (!importedState.evaluacion || typeof importedState.evaluacion !== "object") {
    importedState.evaluacion = { criterios: [], pesos: {}, valoraciones: {}, sensibilidad: {} };
  }

  if (!importedState.seleccion || typeof importedState.seleccion !== "object") {
    importedState.seleccion = { alternativa: "", justificacion: "" };
  }

  if (!Array.isArray(importedState.bitacora)) {
    importedState.bitacora = [];
  }

  if (!importedState.problema || typeof importedState.problema !== "object") {
    importedState.problema = { condicion: "", atributo: "", poblacion: "", delimitacion: "", enunciado: "" };
  }

  if (!importedState.participacion || typeof importedState.participacion !== "object") {
    importedState.participacion = {
      tecnica: "", involucrados: "", momento: "", producto: "", limitaciones: "", justificacion: "",
    };
  }

  if (!("editingActorIndex" in importedState)) {
    importedState.editingActorIndex = null;
  }

  /*
   * Mantener la navegación en una pantalla válida.
   */
  if (
    typeof importedState.current !== "number" ||
    importedState.current < 0 ||
    importedState.current > 10
  ) {
    importedState.current = 0;
  }

  return importedState;
}
