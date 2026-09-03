export function evaluarCriteriosAutomaticos(t) {
  const c1 = !!t && t.length > 5 &&
    !/^(capacitar|crear|construir|implementar|diseñar|desarrollar|promover|fortalecer|realizar|garantizar)\b/i.test(t) &&
    /\b(dificultad|dificultades|limitad[ao]s?|insuficiente|inestable|bajo|baja|escas[ao]|restringid[ao]|débil|deterioro|brecha|barrera)\b/i.test(t);
  const c2 = !!t && !/\b(falta\s+de|faltan|no\s+hay|ausencia\s+de|se\s+requiere|necesidad\s+de|crear|construir|implementar|capacitar|plataforma|app|aplicación|centro\s+de)\b/i.test(t);
  const c3 = !!t && /\b(j[oó]ven(?:es)?|juventud|poblaci[oó]n\s+juvenil)\b/i.test(t);
  const c4 = !!t && /\b(manizales|zona\s+rural|corregimiento(?:s)?|vereda(?:s)?|caldas)\b/i.test(t);
  const c5 = !!t && t.length >= 25 && t.length <= 260 && !t.includes("\n");
  const c6 = !!t && !/\b(y además|así como también|junto con ello|y por otra parte)\b/i.test(t);

  return [
    { num: 1, ok: c1, label: "1. Estado negativo existente", msg: c1 ? "Expresa una situación negativa real y verificable (no una acción en infinitivo)." : "Debe redactarse como un estado negativo existente (ej. dificultades, limitaciones, brechas), no como una acción." },
    { num: 2, ok: c2, label: "2. No incorpora una solución predeterminada", msg: c2 ? "No incorpora carencias de solución ni nombres de intervenciones preconcebidas." : "Evita formular el problema como la carencia de una solución específica (ej. 'falta de...') o adelantar intervenciones." },
    { num: 3, ok: c3, label: "3. Población afectada identificable", msg: c3 ? "Identifica claramente a la población objetivo (jóvenes rurales del municipio)." : "El enunciado debe especificar la población directamente afectada (jóvenes rurales)." },
    { num: 4, ok: c4, label: "4. Territorio delimitado", msg: c4 ? "Delimita con precisión el ámbito territorial (Manizales / zona rural)." : "El enunciado debe delimitar la ubicación territorial específica del proyecto (Manizales / zona rural)." },
    { num: 5, ok: c5, label: "5. Extensión controlada (oración única)", msg: c5 ? "Extensión adecuada; se lee fluidamente en una sola oración continua." : "El enunciado debe poder leerse como una sola oración continua y sintética (máximo 260 caracteres)." },
    { num: 6, ok: c6, label: "6. Un solo núcleo problemático", msg: c6 ? "Concentra el análisis en un solo núcleo problemático bien definido." : "Revisa si se están uniendo dos o más problemas no relacionados en el mismo enunciado." },
  ];
}