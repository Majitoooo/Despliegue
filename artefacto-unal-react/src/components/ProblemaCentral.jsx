import { useCasoContext } from "../context/casoContext.jsx";
import { useNavegacion } from "../context/navegacionContext.jsx";
import { composeCentralProblem, validateCentralProblem } from "../utils/problemaCentral.js";

export function ProblemaCentral({ irASubpantalla }) {
  const { caso, setCaso } = useCasoContext();
  const p = caso.problema;
  const statement = composeCentralProblem(p);
  const checks = validateCentralProblem(p);

  function actualizarCampo(key, valor) {
    setCaso(prev => ({ ...prev, problema: { ...prev.problema, [key]: valor } }));
  }

  function confirmar() {
    const nuevosChecks = validateCentralProblem(caso.problema);
    if (!nuevosChecks.every(c => c.ok)) {
      alert("Corrige los hallazgos de formulación antes de confirmar el problema central.");
      return;
    }
    const enunciado = composeCentralProblem(caso.problema);

    setCaso(prev => {
      const nodos = [...prev.nodos];
      const idx = nodos.findIndex(n => n.codigo === "P");
      if (idx >= 0) {
        nodos[idx] = { ...nodos[idx], tipo: "problema", nivel: 0, padre: "", enunciado, confianza: nodos[idx].confianza || "Media", origen: nodos[idx].origen || "Formulador" };
      } else {
        nodos.unshift({ codigo: "P", tipo: "problema", nivel: 0, padre: "", enunciado, evidencia: "", lineaBase: "", confianza: "Media", origen: "Formulador" });
      }
      return { ...prev, nodos, problema: { ...prev.problema, enunciado } };
    });

    alert("Problema central confirmado.");
    irASubpantalla("causas");
  }

  return (
    <div className="problem-subscreen active">
      <div className="card">
        <div className="section-head">
          <div>
            <h3>2. Problema central</h3>
            <p>Formula el problema como un estado negativo observable, con población y territorio definidos.</p>
          </div>
        </div>

        <div className="field">
          <label>Enunciado del problema central</label>
          <textarea readOnly style={{ background: "#f7f8f8" }} value={statement} />
        </div>

        <div className="grid" style={{ marginTop: 16 }}>
          <div className="field span-3">
            <label htmlFor="problemCondition">Condición negativa observable *</label>
            <textarea id="problemCondition" placeholder="¿Qué estado negativo se observa?"
              value={p.condicion} onChange={e => actualizarCampo("condicion", e.target.value)} />
          </div>
          <div className="field span-3">
            <label htmlFor="problemAttribute">Atributo o manifestación *</label>
            <textarea id="problemAttribute" placeholder="¿Cómo se manifiesta el problema?"
              value={p.atributo} onChange={e => actualizarCampo("atributo", e.target.value)} />
          </div>
          <div className="field span-3">
            <label htmlFor="problemPopulationBuilder">Población afectada *</label>
            <textarea id="problemPopulationBuilder" placeholder="¿Quiénes están afectados?"
              value={p.poblacion} onChange={e => actualizarCampo("poblacion", e.target.value)} />
          </div>
          <div className="field span-3">
            <label htmlFor="problemDelimitation">Territorio y delimitación *</label>
            <textarea id="problemDelimitation" placeholder="¿Dónde y durante qué periodo ocurre?"
              value={p.delimitacion} onChange={e => actualizarCampo("delimitacion", e.target.value)} />
          </div>
        </div>

        <div className="notice" style={{ marginTop: 16 }}>
          <strong>Regla metodológica:</strong> evita expresiones como "falta", "no hay", "se necesita", "capacitar", "construir" o "implementar". El problema debe expresar un estado negativo, no la ausencia de una solución.
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn primary" onClick={() => {}}>Validar formulación</button>
          <button type="button" className="btn" onClick={confirmar}>Confirmar problema central</button>
        </div>

        <div style={{ marginTop: 16 }}>
          {checks.map(check => (
            <div className="notice" key={check.title} style={{ borderLeft: `4px solid ${check.ok ? "#2e7d32" : "#b42318"}`, background: check.ok ? "#f3faf4" : "#fff5f4" }}>
              <strong>{check.ok ? "✓" : "✕"} {check.title}</strong>
              <div className="small-note" style={{ marginTop: 4 }}>{check.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}