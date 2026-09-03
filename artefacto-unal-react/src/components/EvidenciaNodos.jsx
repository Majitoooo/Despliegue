import { useCasoContext } from "../context/casoContext.jsx";
import {
  ordenarNodosEvidencia,
  requirement,
  confidenceClass,
  estadoSustentacion,
  tipoLabel,
} from "../utils/evidenciaNodos.js";

export function EvidenciaNodos() {
  const { caso } = useCasoContext();
  const nodes = Array.isArray(caso.nodos) ? caso.nodos : [];

  if (!nodes.length) {
    return <div className="notice">Aún no hay nodos registrados.</div>;
  }

  const ordered = ordenarNodosEvidencia(nodes);

  return (
    <>
      <div className="node-evidence-summary">
        <div>
          <strong>{ordered.length} elementos con trazabilidad</strong>
          <span>La ficha se alimenta directamente de los nodos registrados en el árbol.</span>
        </div>

        <div className="node-evidence-legend">
          <span className="badge success">Sustentación completa</span>
          <span className="badge warning">Pendiente de fortalecer</span>
          <span className="badge danger">Sin evidencia</span>
        </div>
      </div>

      <div className="node-evidence-table-wrap">
        <table className="node-evidence-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Enunciado</th>
              <th>Tipo / nivel</th>
              <th>Evidencia</th>
              <th>Línea base</th>
              <th>Confianza</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {ordered.map(node => {
              const { hasEvidence, hasBaseline, statusClass, statusText } = estadoSustentacion(node);
              const confidence = node.confianza || "Baja";

              return (
                <tr key={node.codigo}>
                  <td>
                    <strong>{node.codigo}</strong>
                    {node.codigo === "P" && <span className="badge">Problema</span>}
                  </td>

                  <td>
                    <div className="node-evidence-statement">{node.enunciado || ""}</div>
                    <div className="small-note">Padre: {node.padre || "—"}</div>
                  </td>

                  <td>
                    <span className="badge">{tipoLabel(node)}</span>
                    <div className="small-note" style={{ marginTop: 5 }}>
                      Nivel {node.nivel ?? "—"}
                    </div>
                  </td>

                  <td>
                    <div className={hasEvidence ? "node-evidence-value" : "node-evidence-missing"}>
                      {node.evidencia || "Pendiente de fuente"}
                    </div>
                  </td>

                  <td>
                    <div className={hasBaseline ? "node-evidence-value" : "node-evidence-missing"}>
                      {node.lineaBase || "Pendiente de dato"}
                    </div>
                  </td>

                  <td>
                    <span className={`badge ${confidenceClass(confidence)}`}>{confidence}</span>
                  </td>

                  <td>
                    <span className={`badge ${statusClass}`}>{statusText}</span>
                    <div className="small-note" style={{ marginTop: 5 }}>
                      {requirement(node)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="notice" style={{ marginTop: 12 }}>
        <strong>Regla de sustentación:</strong> un nodo no se considera suficientemente sustentado solo
        porque sea plausible. Debe poder señalarse una fuente, un dato de línea base o una verificación
        pendiente. Las propuestas de IA deben contrastarse antes de aceptarse.
      </div>
    </>
  );
}
