/* =========================================================
   PASO 2.4 · FICHA DE SUSTENTACIÓN DE NODOS
   Traducción de renderNodeEvidence()
   ========================================================= */

/*
 * Para el Avance 2:
 * P y nodos de primer nivel requieren sustentación.
 * Los demás se muestran para trazabilidad.
 */
export function ordenarNodosEvidencia(nodes) {
  return [...nodes].sort(function (a, b) {
    if (a.codigo === "P") return -1;
    if (b.codigo === "P") return 1;

    if (a.tipo !== b.tipo) {
      return a.tipo === "efecto" ? -1 : 1;
    }

    return Number(a.nivel || 0) - Number(b.nivel || 0);
  });
}

export function requirement(node) {
  if (node.codigo === "P") {
    return "Obligatoria";
  }

  if (Number(node.nivel) === 1) {
    return "Obligatoria";
  }

  return "Opcional en Avance 2";
}

export function confidenceClass(value) {
  if (value === "Alta") {
    return "success";
  }

  if (value === "Baja") {
    return "danger";
  }

  return "warning";
}

export function estadoSustentacion(node) {
  const hasEvidence = Boolean(String(node.evidencia || "").trim());
  const hasBaseline = Boolean(String(node.lineaBase || "").trim());
  const complete = hasEvidence && hasBaseline;

  return {
    hasEvidence,
    hasBaseline,
    complete,
    statusClass: complete ? "success" : hasEvidence ? "warning" : "danger",
    statusText: complete
      ? "Sustentada"
      : hasEvidence
        ? "Completar línea base"
        : "Falta evidencia",
  };
}

export function tipoLabel(node) {
  return node.tipo === "causa" ? "Causa" : node.tipo === "efecto" ? "Efecto" : "Problema";
}
