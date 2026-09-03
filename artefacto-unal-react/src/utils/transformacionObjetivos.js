/* =========================================================
   PASO 3.1 · TRANSFORMACIÓN DE PROBLEMAS EN OBJETIVOS
   Traducción de syncObjectivesFromProblemNodes()
   y proposePositiveState()
   ========================================================= */

/*
 * Versión pura de syncObjectivesFromProblemNodes():
 * recibe los nodos y los objetivos actuales y devuelve
 * la lista de objetivos sincronizada, sin sobrescribir
 * las decisiones del formulador.
 */
export function syncObjectivesFromProblemNodes(nodos, objetivos) {
  const nodes = Array.isArray(nodos) ? nodos : [];
  const objectives = Array.isArray(objetivos) ? objetivos.map(o => ({ ...o })) : [];

  nodes.forEach(function (nodo) {
    if (!nodo || !nodo.codigo) {
      return;
    }

    const existente = objectives.find(function (objetivo) {
      return objetivo.codigo === nodo.codigo;
    });

    if (!existente) {
      objectives.push({
        codigo: nodo.codigo,
        tipoOrigen: nodo.tipo || "",
        nivel: nodo.nivel ?? null,
        padre: nodo.padre || "",
        enunciadoOrigen: nodo.enunciado || "",

        /* El objetivo todavía NO se genera automáticamente */
        objetivo: "",

        /* Toda propuesta automática deberá quedar trazada */
        propuesta: true,
        confianza: "Baja",
        origen: "Propuesta IA",

        /* Decisión exclusiva del formulador */
        posibleSupuesto: false,
      });
    } else {
      /*
       * Mantener actualizada la trazabilidad con el nodo
       * original sin sobrescribir las decisiones del formulador.
       */
      existente.tipoOrigen = nodo.tipo || existente.tipoOrigen;
      existente.nivel = nodo.nivel ?? existente.nivel;
      existente.padre = nodo.padre || existente.padre;
      existente.enunciadoOrigen = nodo.enunciado || existente.enunciado;
    }
  });

  return objectives;
}

/*
 * Traducción de generateObjectiveProposals():
 * completa únicamente los objetivos que el formulador
 * todavía no ha escrito.
 */
export function generateObjectiveProposals(nodos, objetivos) {
  const objectives = syncObjectivesFromProblemNodes(nodos, objetivos);
  const nodes = Array.isArray(nodos) ? nodos : [];

  nodes.forEach(function (node) {
    const objective = objectives.find(function (item) {
      return item.codigo === node.codigo;
    });

    if (!objective) {
      return;
    }

    /*
     * Si el formulador ya escribió un objetivo,
     * NO lo sobrescribimos.
     */
    if (String(objective.objetivo || "").trim()) {
      return;
    }

    objective.objetivo = proposePositiveState(node.enunciado);
    objective.propuesta = true;
    objective.confianza = "Baja";
    objective.origen = "Propuesta IA";
  });

  return objectives;
}

export function proposePositiveState(text) {
  const value = String(text || "").trim();

  if (!value) {
    return "";
  }

  /*
   * Transformaciones de estado frecuentes.
   * No son decisiones metodológicas definitivas.
   */
  const replacements = [
    { pattern: /^limitadas oportunidades/i, replacement: "Mayores oportunidades" },
    { pattern: /^baja disponibilidad/i, replacement: "Mayor disponibilidad" },
    { pattern: /^limitada disponibilidad/i, replacement: "Mayor disponibilidad" },
    { pattern: /^limitada oferta/i, replacement: "Mayor oferta" },
    { pattern: /^baja oferta/i, replacement: "Mayor oferta" },
    { pattern: /^débil articulación/i, replacement: "Articulación fortalecida" },
    { pattern: /^baja articulación/i, replacement: "Articulación mejorada" },
    { pattern: /^menor disponibilidad/i, replacement: "Mayor disponibilidad" },
    { pattern: /^alto nivel de/i, replacement: "Nivel reducido de" },
    { pattern: /^alta proporción de/i, replacement: "Menor proporción de" },
    { pattern: /^baja proporción de/i, replacement: "Mayor proporción de" },
    { pattern: /^escasa/i, replacement: "Mayor disponibilidad de" },
    { pattern: /^insuficiente/i, replacement: "Nivel suficiente de" },
  ];

  for (let i = 0; i < replacements.length; i++) {
    const item = replacements[i];

    if (item.pattern.test(value)) {
      return value.replace(item.pattern, item.replacement);
    }
  }

  /*
   * Fallback deliberadamente conservador.
   * Se marca como propuesta y requiere edición.
   */
  return "Condición mejorada: " + value.charAt(0).toLowerCase() + value.slice(1);
}

/*
 * Traducción de updateObjectiveValue().
 * El objetivo sigue siendo propuesta hasta que el formulador
 * lo revise y valide posteriormente.
 */
export function updateObjectiveValue(objetivos, codigo, value) {
  if (!Array.isArray(objetivos)) {
    return objetivos;
  }

  return objetivos.map(function (item) {
    if (item.codigo !== codigo) {
      return item;
    }

    return {
      ...item,
      objetivo: String(value || "").trim(),
      propuesta: true,
      confianza: "Baja",
    };
  });
}

/* Traducción de toggleObjectiveAssumption() */
export function toggleObjectiveAssumption(objetivos, codigo, checked) {
  if (!Array.isArray(objetivos)) {
    return objetivos;
  }

  return objetivos.map(function (item) {
    if (item.codigo !== codigo) {
      return item;
    }

    return { ...item, posibleSupuesto: Boolean(checked) };
  });
}

/* Rol y clase visual del nodo dentro del árbol de objetivos */
export function objectiveRole(node) {
  if (node.codigo === "P") {
    return "Propósito";
  }

  if (node.tipo === "causa") {
    return node.raiz ? "Medio operacionalizable" : "Medio";
  }

  return "Fin";
}

export function objectiveRoleClass(node) {
  if (node.codigo === "P") {
    return "purpose";
  }

  return node.tipo === "causa" ? "means" : "ends";
}
