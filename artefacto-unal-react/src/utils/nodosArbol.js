export function nextNodeCode(nodos, type, level) {
  const prefix = type === "causa" ? "C" : "E";
  const existing = nodos.filter(n => n && n.tipo === type && Number(n.nivel) === Number(level));
  return prefix + Number(level) + "." + (existing.length + 1);
}