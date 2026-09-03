function normalizeTextForValidation(text) {
  return String(text || "").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[.,;:!?¿¡()"']/g, "")
    .replace(/\s+/g, " ").trim();
}

function containsAny(text, patterns) {
  const normalized = normalizeTextForValidation(text);
  return patterns.some(pattern => normalized.includes(pattern));
}

export function actorValidationMessages(actors = []) {
  const messages = [];

  if (actors.length < 8) {
    messages.push("Hay menos de ocho involucrados. Revise si faltan financiadores, reguladores, organizaciones relacionadas, afectados y grupos que podrían perder algo con la solución.");
  }

  const hasNegative = actors.some(actor => String(actor.posicion) === "-1");
  if (actors.length > 0 && !hasNegative) {
    messages.push("Ningún involucrado tiene posición negativa. Un análisis sin opositores suele requerir revisar si se omitieron grupos que podrían resistirse o perder algo con el proyecto.");
  }

  actors.forEach(actor => {
    if (!String(actor.razon || "").trim()) {
      messages.push(`La valoración de «${actor.grupo || "grupo sin nombre"}» no tiene razón registrada. Un número sin justificación no es defendible.`);
    }
  });

  actors.forEach(actor => {
    if (!Array.isArray(actor.problemas_percibidos) || actor.problemas_percibidos.length === 0) {
      messages.push(`«${actor.grupo || "Grupo sin nombre"}» no registra problemas percibidos.`);
    }
  });

  actors.forEach(actor => {
    if (!String(actor.recursos_mandatos || "").trim()) {
      messages.push(`«${actor.grupo || "Grupo sin nombre"}» no registra recursos y mandatos.`);
    }
  });

  const positivePatterns = ["mejora", "mejoras", "aumento", "aumentar", "incremento", "incrementar", "fortalecimiento", "fortalecer", "mayor acceso", "mayor cobertura", "alta calidad", "mejor calidad", "desarrollo", "crecimiento", "oportunidades", "bienestar", "satisfaccion"];
  actors.forEach(actor => {
    (actor.problemas_percibidos || []).forEach(problem => {
      if (containsAny(problem, positivePatterns)) {
        messages.push(`«${actor.grupo}» tiene un problema percibido que podría estar formulado en positivo: «${problem}». Revise que exprese claramente un estado negativo.`);
      }
    });
  });

  const absencePatterns = ["no hay ", "falta ", "faltan ", "ausencia de ", "sin acceso", "sin apoyo", "sin capacitacion", "sin capacitación", "sin asistencia", "sin recursos", "sin infraestructura"];
  actors.forEach(actor => {
    (actor.problemas_percibidos || []).forEach(problem => {
      if (containsAny(problem, absencePatterns)) {
        messages.push(`«${actor.grupo}» registra un problema percibido como ausencia o falta: «${problem}». Revise si describe realmente el problema o si está nombrando implícitamente una solución ausente.`);
      }
    });
  });

  if (actors.length >= 2) {
    const problemGroups = new Map();
    actors.forEach(actor => {
      const uniqueProblems = new Set((actor.problemas_percibidos || []).map(normalizeTextForValidation).filter(Boolean));
      uniqueProblems.forEach(problem => {
        problemGroups.set(problem, (problemGroups.get(problem) || 0) + 1);
      });
    });
    problemGroups.forEach((count, problem) => {
      if (count === actors.length) {
        messages.push(`Todos los grupos perciben el mismo problema: «${problem}». Revise si realmente existe una única percepción o si falta desagregar diferencias entre involucrados.`);
      }
    });
  }

  actors.forEach(actor => {
    const force = Number(actor.fuerza);
    const interest = Number(actor.intensidad);
    if (force >= 4 && interest <= 2) {
      messages.push(`«${actor.grupo}» presenta poder ≥ 4 e interés ≤ 2. Revise si esta condición debe reaparecer como posible supuesto en el Paso 9.`);
    }
  });

  actors.forEach(actor => {
    const group = normalizeTextForValidation(actor.grupo);
    if (["la comunidad", "comunidad", "la ciudadania", "ciudadania"].includes(group)) {
      messages.push(`«${actor.grupo}» es un grupo demasiado amplio. Desagregue sus intereses y posiciones cuando existan diferencias internas.`);
    }
  });

  return messages;
}