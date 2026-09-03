/* =========================================================
   PASO 2.5 · VALIDACIÓN METODOLÓGICA
   Traducción de runProblemValidation()
   ========================================================= */

export function runProblemValidation(nodos) {
  const nodes = Array.isArray(nodos) ? nodos : [];

  const root = nodes.find(function (node) {
    return node && node.codigo === "P";
  });

  /* =========================================================
     1. DIRECCIÓN CAUSAL
     ========================================================= */

  const directionProblems = [];

  nodes
    .filter(function (node) {
      return node && node.codigo !== "P";
    })
    .forEach(function (node) {
      const parent = nodes.find(function (candidate) {
        return candidate && candidate.codigo === node.padre;
      });

      if (!parent) {
        directionProblems.push(node.codigo + " no tiene un padre válido.");
        return;
      }

      if (node.tipo === "causa") {
        if (parent.codigo !== "P" && parent.tipo !== "causa") {
          directionProblems.push(
            node.codigo + " está conectado a un nodo que no corresponde a una causa."
          );
        }
      }

      if (node.tipo === "efecto") {
        if (parent.codigo !== "P" && parent.tipo !== "efecto") {
          directionProblems.push(
            node.codigo + " está conectado a un nodo que no corresponde a un efecto."
          );
        }
      }
    });

  /* =========================================================
     2. NIVEL
     ========================================================= */

  const levelProblems = [];

  nodes
    .filter(function (node) {
      return node && node.codigo !== "P";
    })
    .forEach(function (node) {
      const parent = nodes.find(function (candidate) {
        return candidate && candidate.codigo === node.padre;
      });

      if (!parent) {
        return;
      }

      const expectedLevel = parent.codigo === "P" ? 1 : Number(parent.nivel) + 1;

      if (Number(node.nivel) !== expectedLevel) {
        levelProblems.push(
          node.codigo +
          " está en nivel " +
          node.nivel +
          " pero su padre " +
          parent.codigo +
          " corresponde al nivel " +
          expectedLevel +
          "."
        );
      }
    });

  /* =========================================================
     3. SUFICIENCIA
     =========================================================
     Esta prueba no puede resolverse completamente por código.
     El sistema identifica ramas terminales y solicita juicio
     del formulador.
     ========================================================= */

  const causeRoots = nodes.filter(function (node) {
    if (!node || node.tipo !== "causa") {
      return false;
    }

    return !nodes.some(function (child) {
      return child && child.padre === node.codigo;
    });
  });

  const sufficiencyReady = causeRoots.length > 0 && Boolean(root);

  /* =========================================================
     4. NO CIRCULARIDAD
     ========================================================= */

  const circularProblems = [];

  function createsCycle(node) {
    const visited = new Set();

    let current = node.padre;

    while (current && current !== "P") {
      if (visited.has(current)) {
        return true;
      }

      if (current === node.codigo) {
        return true;
      }

      visited.add(current);

      const parent = nodes.find(function (candidate) {
        return candidate && candidate.codigo === current;
      });

      if (!parent) {
        return false;
      }

      current = parent.padre;
    }

    return false;
  }

  nodes
    .filter(function (node) {
      return node && node.codigo !== "P";
    })
    .forEach(function (node) {
      if (createsCycle(node)) {
        circularProblems.push(node.codigo);
      }
    });

  /* =========================================================
     5. EVIDENCIA
     ========================================================= */

  const evidenceProblems = [];

  nodes
    .filter(function (node) {
      return node && node.codigo !== "P";
    })
    .forEach(function (node) {
      const hasEvidence = Boolean(String(node.evidencia || "").trim());
      const hasBaseline = Boolean(String(node.lineaBase || "").trim());

      if (!hasEvidence) {
        evidenceProblems.push(node.codigo + ": falta evidencia.");
      } else if (!hasBaseline) {
        evidenceProblems.push(node.codigo + ": tiene evidencia pero falta línea base.");
      }
    });

  /*
   * El problema central también debe quedar sustentado.
   */
  if (root) {
    if (!String(root.evidencia || "").trim()) {
      evidenceProblems.push("P: falta evidencia del problema central.");
    }
  } else {
    evidenceProblems.push("No existe el problema central P.");
  }

  /* =========================================================
     RESULTADOS
     ========================================================= */

  return [
    {
      key: "direccion",
      title: "1. Dirección causal",
      question: "Cada vínculo debe poder leerse como «X produce Y» y «Y ocurre porque X».",
      ok: directionProblems.length === 0,
      details: directionProblems,
    },
    {
      key: "nivel",
      title: "2. Nivel",
      question: "Entre un nodo y su superior inmediato no debe faltar un eslabón causal evidente.",
      ok: levelProblems.length === 0,
      details: levelProblems,
    },
    {
      key: "suficiencia",
      title: "3. Suficiencia",
      question:
        "Si las causas inferiores se resolvieran, ¿sería razonable esperar que desapareciera el nodo superior?",
      ok: false,
      pending: true,
      details: sufficiencyReady
        ? [
          "El sistema identificó " +
          causeRoots.length +
          " causa(s) terminal(es). " +
          "La suficiencia causal requiere juicio del formulador.",
        ]
        : ["El árbol todavía no tiene una estructura suficiente para realizar esta lectura."],
    },
    {
      key: "circularidad",
      title: "4. No circularidad",
      question: "Ningún nodo debe terminar dependiendo de sí mismo mediante su cadena de padres.",
      ok: circularProblems.length === 0,
      details: circularProblems,
    },
    {
      key: "evidencia",
      title: "5. Evidencia",
      question: "Cada nodo debe contar con al menos una fuente o registro que permita contrastarlo.",
      ok: evidenceProblems.length === 0,
      details: evidenceProblems,
    },
  ];
}

/* Traducción del cálculo de encabezado de renderProblemValidationResults() */
export function resumenValidacion(tests) {
  const failed = tests.filter(function (test) {
    return !test.ok && !test.pending;
  });

  const pending = tests.filter(function (test) {
    return test.pending;
  });

  const passed = tests.filter(function (test) {
    return test.ok;
  });

  let summaryTitle;
  let summaryText;
  let summaryClass;

  if (failed.length > 0) {
    summaryTitle = "El árbol requiere correcciones";
    summaryText = failed.length + " prueba(s) presentan hallazgos.";
    summaryClass = "error";
  } else if (pending.length > 0) {
    summaryTitle = "Validación estructural favorable, juicio pendiente";
    summaryText =
      "Las pruebas automáticas no detectan fallas estructurales, " +
      "pero aún debe revisarse la suficiencia y la validación externa.";
    summaryClass = "warning";
  } else {
    summaryTitle = "Validación automática favorable";
    summaryText = "No se detectaron fallas automáticas en las cinco pruebas.";
    summaryClass = "success";
  }

  return {
    summaryTitle,
    summaryText,
    summaryClass,
    passed: passed.length,
    pending: pending.length,
    failed: failed.length,
  };
}

export function estadoPrueba(test) {
  return test.pending ? "pending" : test.ok ? "ok" : "error";
}

export function etiquetaPrueba(test) {
  return test.pending ? "JUICIO REQUERIDO" : test.ok ? "CONFORME" : "REVISAR";
}
