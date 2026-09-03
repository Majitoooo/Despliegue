export function normalizeLines(text) {
  return text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
}

export function actorPositionClass(position) {
  if (position === "1") return "position-positive";
  if (position === "-1") return "position-negative";
  return "position-neutral";
}

export function actorPositionLabel(position) {
  if (position === "1") return "+1 · A favor";
  if (position === "-1") return "−1 · En contra";
  return "0 · Neutral";
}

export function actorQuadrant(actor) {
  const force = Number(actor.fuerza);
  const intensity = Number(actor.intensidad);
  const highPower = force >= 4;
  const highInterest = intensity >= 4;
  if (highPower && highInterest) return "Alto poder · Alto interés";
  if (highPower && !highInterest) return "Alto poder · Bajo interés";
  if (!highPower && highInterest) return "Bajo poder · Alto interés";
  return "Bajo poder · Bajo interés";
}

// La resultante NO se almacena; se calcula cada vez que se requiere.
export function calculateActorResult(actor) {
  return Number(actor.fuerza || 0) * Number(actor.intensidad || 0) * Number(actor.posicion || 0);
}

export function validateActor(actor) {
  const missing = [];
  if (!actor.grupo) missing.push("cargo u organización");
  if (!actor.naturaleza) missing.push("naturaleza");
  if (!actor.relacion) missing.push("relación con el problema");
  if (!actor.rol) missing.push("rol frente al problema");
  if (!actor.intereses) missing.push("intereses");
  if (!actor.problemas_percibidos.length) missing.push("problemas percibidos");
  if (!actor.recursos_mandatos) missing.push("recursos y mandatos");
  if (actor.posicion === "") missing.push("posición");
  if (!actor.fuerza) missing.push("fuerza / poder");
  if (!actor.intensidad) missing.push("intensidad / interés");
  if (!actor.razon) missing.push("razón de la valoración");
  if (!actor.estrategia) missing.push("estrategia de relacionamiento");

  if (missing.length) {
    alert("Complete los siguientes campos antes de continuar:\n\n• " + missing.join("\n• "));
    return false;
  }
  return true;
}

export const FORM_INICIAL = {
  grupo: "", naturaleza: "", relacion: "", rol: "", intereses: "",
  problemas_percibidos: [], recursos_mandatos: "", posicion: "",
  fuerza: "", intensidad: "", razon: "", estrategia: "",
};