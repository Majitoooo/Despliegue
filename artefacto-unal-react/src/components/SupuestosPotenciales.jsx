import { useCasoContext } from "../context/casoContext.jsx";

/* Traducción de renderObjectiveAssumptions() */
export function SupuestosPotenciales({ onQuitar }) {
  const { caso } = useCasoContext();

  const objectives = Array.isArray(caso.objetivos) ? caso.objetivos : [];

  const candidates = objectives.filter(function (objective) {
    return objective.posibleSupuesto === true;
  });

  if (!candidates.length) {
    return <div className="notice">Aún no se han identificado objetivos candidatos a supuesto.</div>;
  }

  return (
    <div className="potential-assumptions-list">
      {candidates.map(objective => (
        <div className="potential-assumption-card" key={objective.codigo}>
          <div className="potential-assumption-header">
            <div>
              <strong>{objective.codigo}</strong>
              <span className="potential-assumption-badge">POSIBLE SUPUESTO</span>
            </div>

            <button type="button" className="btn-mini" onClick={() => onQuitar(objective.codigo)}>
              Quitar
            </button>
          </div>

          <div className="potential-assumption-objective">
            {objective.objetivo || "Objetivo pendiente de formulación"}
          </div>

          <div className="potential-assumption-note">
            Candidato identificado por el formulador. La decisión definitiva se realizará posteriormente en
            el Paso 9 · Supuestos.
          </div>
        </div>
      ))}
    </div>
  );
}
