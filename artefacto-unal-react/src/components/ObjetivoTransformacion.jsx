import { useEffect, useState } from "react";
import { useCasoContext } from "../context/casoContext.jsx";
import {
  syncObjectivesFromProblemNodes,
  generateObjectiveProposals,
  updateObjectiveValue,
  toggleObjectiveAssumption,
  objectiveRole,
  objectiveRoleClass,
} from "../utils/transformacionObjetivos.js";
import { SupuestosPotenciales } from "./SupuestosPotenciales.jsx";

export function ObjetivoTransformacion() {
  const { caso, setCaso } = useCasoContext();
  const [borradores, setBorradores] = useState({});

  const nodes = Array.isArray(caso.nodos) ? caso.nodos : [];
  const objectives = Array.isArray(caso.objetivos) ? caso.objetivos : [];

  /*
   * Garantizar correspondencia nodo ↔ objetivo,
   * igual que la llamada a syncObjectivesFromProblemNodes()
   * al inicio de renderObjectiveTransformation().
   */
  useEffect(() => {
    setCaso(prev => {
      const sincronizados = syncObjectivesFromProblemNodes(prev.nodos, prev.objetivos);
      const sinCambios = JSON.stringify(sincronizados) === JSON.stringify(prev.objetivos || []);
      return sinCambios ? prev : { ...prev, objetivos: sincronizados };
    });
  }, [caso.nodos, setCaso]);

  function generarPropuestas() {
    setCaso(prev => ({
      ...prev,
      objetivos: generateObjectiveProposals(prev.nodos, prev.objetivos),
    }));
    setBorradores({});
  }

  function guardarObjetivo(codigo, value) {
    setCaso(prev => ({ ...prev, objetivos: updateObjectiveValue(prev.objetivos, codigo, value) }));
    setBorradores(prev => {
      const siguiente = { ...prev };
      delete siguiente[codigo];
      return siguiente;
    });
  }

  function marcarSupuesto(codigo, checked) {
    setCaso(prev => ({
      ...prev,
      objetivos: toggleObjectiveAssumption(prev.objetivos, codigo, checked),
    }));
  }

  return (
    <div className="objective-subscreen active">
      <div className="card">
        <div className="section-head">
          <div>
            <h3>1. Transformación de problemas en objetivos</h3>
            <p>
              Cada nodo del árbol de problemas se transforma en un estado positivo deseado. La propuesta es
              editable y no constituye una decisión automática.
            </p>
          </div>
        </div>

        {!nodes.length ? (
          <div className="notice">
            No hay nodos provenientes del árbol de problemas. Regresa al Paso 2 y construye primero el árbol.
          </div>
        ) : (
          <>
            <div className="objective-transformation-toolbar">
              <div>
                <strong>Revelado del árbol de objetivos</strong>
                <span>
                  {nodes.length} nodos provenientes del árbol de problemas. Cada conversión permanece editable
                  y marcada como propuesta.
                </span>
              </div>

              <button type="button" className="btn" onClick={generarPropuestas}>
                Generar propuestas
              </button>
            </div>

            <div className="objective-transformation-list">
              {nodes.map(node => {
                const objective = objectives.find(item => item.codigo === node.codigo);
                if (!objective) return null;

                const valor = borradores[node.codigo] ?? objective.objetivo ?? "";

                return (
                  <article className="objective-transformation-card" key={node.codigo}>
                    <div className="objective-source">
                      <div>
                        <span className="objective-code">{node.codigo}</span>
                        <span className={`objective-role ${objectiveRoleClass(node)}`}>
                          {objectiveRole(node)}
                        </span>
                        <span className="objective-proposal-badge">Propuesta · Confianza baja</span>
                      </div>

                      <div className="objective-source-meta">
                        Nivel {node.nivel ?? "—"} · Padre {node.padre || "P"}
                      </div>
                    </div>

                    <div className="objective-conversion">
                      <div className="objective-problem-side">
                        <label>Estado negativo de origen</label>
                        <div className="objective-source-text">{node.enunciado || "Sin enunciado"}</div>
                      </div>

                      <div className="objective-arrow">→</div>

                      <div className="objective-target-side">
                        <label htmlFor={`objective-${node.codigo}`}>Objetivo propuesto *</label>

                        <textarea
                          id={`objective-${node.codigo}`}
                          rows={3}
                          placeholder="Escribe un estado positivo deseado y viable..."
                          value={valor}
                          onChange={e =>
                            setBorradores(prev => ({ ...prev, [node.codigo]: e.target.value }))
                          }
                          onBlur={e => guardarObjetivo(node.codigo, e.target.value)}
                        />

                        <div className="objective-edit-note">
                          Editable por el formulador. No debe nombrar directamente una acción o solución.
                        </div>
                      </div>
                    </div>

                    <div className="objective-card-footer">
                      <label className="objective-assumption">
                        <input
                          type="checkbox"
                          checked={Boolean(objective.posibleSupuesto)}
                          onChange={e => marcarSupuesto(node.codigo, e.target.checked)}
                        />
                        <span>Marcar como posible supuesto</span>
                      </label>

                      <span className="objective-origin">
                        {objective.origen === "Propuesta IA" ? "Origen: Propuesta" : "Origen: Formulador"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="notice objective-method-note">
              <strong>Regla metodológica:</strong> convertir un problema en objetivo no significa agregar
              "no" ni nombrar la solución. El resultado debe describir una condición positiva, deseable y
              viable. Las acciones se definirán posteriormente sobre los medios operacionalizables.
            </div>
          </>
        )}
      </div>

      <div className="card">
        <div className="section-head">
          <div>
            <h3>Supuestos potenciales</h3>
            <p>
              Un objetivo puede marcarse como posible supuesto para revisión posterior. El sistema no decide
              cuáles deben ser supuestos.
            </p>
          </div>
        </div>

        <SupuestosPotenciales onQuitar={codigo => marcarSupuesto(codigo, false)} />
      </div>
    </div>
  );
}
