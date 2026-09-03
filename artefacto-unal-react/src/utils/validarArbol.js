export function buildEAPFromTree(caso) {
  return caso.eap || null;
}

export function validarArbol(caso) {
  const nodes = caso.nodos || [];
  const orphan = nodes.filter(n => n.padre !== "P" && !nodes.some(p => p.codigo === n.padre));
  const levelJump = nodes.filter(n => Number(n.nivel) > 1 && !nodes.some(p => p.codigo === n.padre && Number(p.nivel) === Number(n.nivel) - 1));

  const dup = {};
  nodes.forEach(n => {
    const k = n.tipo + "|" + n.enunciado.trim().toLowerCase();
    dup[k] = (dup[k] || 0) + 1;
  });
  const duplicates = nodes.filter(n => dup[n.tipo + "|" + n.enunciado.trim().toLowerCase()] > 1);
  const cross = nodes.filter(n => nodes.some(x => x !== n && x.enunciado.trim().toLowerCase() === n.enunciado.trim().toLowerCase() && x.tipo !== n.tipo));
  const noEvidence = nodes.filter(n => !n.evidencia || !n.lineaBase);
  const actions = nodes.filter(n => n.esAccion || /^(capacitar|crear|construir|implementar|diseñar|instalar|desarrollar|entregar|ejecutar|promover|fortalecer|realizar|dotar)\b/i.test(n.enunciado));
  const directCauses = nodes.filter(n => n.tipo === "causa" && Number(n.nivel) === 1);
  const roots = nodes.filter(n => n.tipo === "causa" && Number(n.nivel) >= 3);
  const flatCauses = nodes.filter(n => n.tipo === "causa").length > 0 && nodes.filter(n => n.tipo === "causa").every(n => Number(n.nivel) === 1 || n.padre === "P");
  const weakNegative = nodes.filter(n => n.tipo === "causa" && !/\b(insuficiente|insuficientemente|limitad[ao]s?|restringid[ao]s?|débil(?:es)?|baj[ao]s?|escas[ao]s?|inestable(?:s)?|dispers[ao]s?|poco|poca|pocas|barreras|desconexión|discontinuo|dificultad(?:es)?|desarticulación|deterioro)\b/i.test(n.enunciado));

  const eap = buildEAPFromTree(caso);
  const componentsOk = !!eap && Array.isArray(eap.componentes) && eap.componentes.length >= 4 && eap.componentes.every(c => Array.isArray(c.actividades) && c.actividades.length >= 3);

  return [
    { ok: !orphan.length, titulo: "1. Prueba de Dirección", mensaje: "No hay nodos huérfanos; cada relación apunta a un padre válido en el árbol.", nodos: orphan.map(n => n.codigo) },
    { ok: !levelJump.length, titulo: "2. Prueba de Nivel", mensaje: "No hay saltos de nivel; cada nodo profundiza sobre el nivel inmediatamente superior (N1 → N2 → N3).", nodos: levelJump.map(n => n.codigo) },
    { ok: directCauses.length >= 3 && roots.length >= 3 && !flatCauses, titulo: "3. Prueba de Suficiencia y Encadenamiento", mensaje: "El árbol cuenta con causas directas (N1), causas intermedias (N2) y raíces profundas (N3); no es una lista plana.", nodos: flatCauses ? directCauses.map(n => n.codigo) : [] },
    { ok: !cross.length && !duplicates.length, titulo: "4. Prueba de No Circularidad y Unicidad", mensaje: "No se detectan duplicados ni el mismo enunciado como causa y efecto a la vez.", nodos: [...cross, ...duplicates].map(n => n.codigo) },
    { ok: !noEvidence.length && !actions.length && !weakNegative.length, titulo: "5. Prueba de Evidencia y Redacción Negativa", mensaje: "Todas las causas son estados negativos verificables y cuentan con evidencia y línea base territorial.", nodos: noEvidence.concat(actions, weakNegative).map(n => n.codigo) },
    { ok: componentsOk, titulo: "6. Derivación a EAP (Componentes y Actividades)", mensaje: "El árbol alimenta 4 componentes y entre 3 y 4 actividades operativas por componente según el manual CEPAL.", nodos: componentsOk ? [] : ["EAP"] },
  ];
}