export function composeCentralProblem(problema) {
  const parts = [problema.condicion, problema.atributo, problema.poblacion, problema.delimitacion].filter(Boolean);
  return parts.join(" ");
}

export function validateCentralProblem(problema) {
  const statement = composeCentralProblem(problema);
  const { condicion: condition, atributo: attribute, poblacion: population, delimitacion: delimitation } = problema;

  const checks = [
    { ok: Boolean(statement), title: "Existe un enunciado", message: statement ? "El problema tiene una formulación." : "Debe construirse el enunciado." },
    { ok: Boolean(condition), title: "Condición negativa", message: condition ? "Se identificó una condición observable." : "Falta la condición negativa observable." },
    { ok: Boolean(attribute), title: "Atributo o manifestación", message: attribute ? "Se identificó la manifestación del problema." : "Falta describir cómo se manifiesta." },
    { ok: Boolean(population), title: "Población afectada", message: population ? "La población está delimitada." : "Debe identificarse la población afectada." },
    { ok: Boolean(delimitation), title: "Territorio y delimitación", message: delimitation ? "El ámbito territorial está delimitado." : "Debe indicarse territorio y periodo." },
  ];

  const solutionPattern = /\b(falta|faltan|no hay|ausencia de|se necesita|se requiere|capacitar|construir|implementar|crear)\b/i;
  checks.push({
    ok: !solutionPattern.test(statement), title: "No está redactado como solución",
    message: solutionPattern.test(statement) ? "El enunciado incorpora una carencia o solución. Reescríbelo como estado negativo." : "No se detectó lenguaje típico de solución.",
  });

  checks.push({
    ok: !/\by\b/i.test(statement), title: "Un solo núcleo problemático",
    message: /\by\b/i.test(statement) ? "Revisa si la conjunción 'y' está uniendo dos problemas." : "No se detectó una posible unión de problemas.",
  });

  checks.push({
    ok: statement.length <= 300, title: "Extensión controlada",
    message: statement.length <= 300 ? "La extensión es manejable." : "El enunciado es demasiado extenso.",
  });

  return checks;
}