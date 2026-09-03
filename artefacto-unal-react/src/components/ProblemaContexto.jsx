import { useCasoContext } from "../context/casoContext.jsx";

export function ProblemaContexto() {
  const { caso } = useCasoContext();
  const c = caso.caso;
  const p = caso.problema;

  return (
    <div className="problem-subscreen active">
      <div className="card">
        <div className="section-head">
          <div>
            <h3>1. Contexto</h3>
            <p>Registra los elementos del caso que delimitan el análisis del problema.</p>
          </div>
        </div>
        <div className="grid">
          <div className="field span-6">
            <label>Nombre del caso</label>
            <input type="text" value={c.titulo || c.nombre || ""} readOnly />
          </div>
          <div className="field span-6">
            <label>Territorio</label>
            <input type="text" value={c.territorio || ""} readOnly />
          </div>
          <div className="field span-6">
            <label>Población afectada</label>
            <input type="text" value={p.poblacion || c.poblacion || ""} readOnly />
          </div>
          <div className="field span-6">
            <label>Periodo</label>
            <input type="text" value={c.periodo || ""} readOnly />
          </div>
          <div className="field span-12">
            <label>Situación problemática</label>
            <textarea value={c.situacion || ""} readOnly />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-head">
          <div>
            <h3>Continuidad con el Paso 1</h3>
            <p>Los problemas percibidos por los involucrados constituyen insumos para el análisis, pero no se convierten automáticamente en causas.</p>
          </div>
        </div>
        <div>
          {caso.involucrados.length === 0 ? (
            <div className="notice">Los involucrados y sus percepciones se cargarán desde el modelo general del artefacto.</div>
          ) : (
            caso.involucrados.map((actor, i) => (
              (actor.problemas_percibidos || []).length > 0 && (
                <div className="notice" key={i}>
                  <strong>{actor.grupo}:</strong> {actor.problemas_percibidos.join("; ")}
                </div>
              )
            ))
          )}
        </div>
      </div>
    </div>
  );
}