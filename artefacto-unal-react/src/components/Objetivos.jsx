import { useCasoContext } from "../context/casoContext.jsx";
import { getObjectivesTree } from "../utils/objetivos.js";
import { SmartNode } from "./SmartNode.jsx";

export function Objetivos() {
  const { caso } = useCasoContext();
  const objList = getObjectivesTree(caso);

  const f1Nodes = objList.filter(o => o.tipo.includes("Fin directo"));
  const m1Nodes = objList.filter(o => o.tipo.includes("Medio directo"))
    .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), "es", { numeric: true }));
  const objP = objList.find(o => o.codigo === "Obj_P") || { codigo: "Obj_P", enunciado: "Objetivo Central / Propósito" };

  function pillClass(tipo) {
    return tipo.includes("Fin") ? "pill blue" : tipo.includes("Propósito") ? "pill red" : "pill green";
  }

  return (
    <div>
      <h2>Paso 3 · Objetivos</h2>

      <table>
        <thead>
          <tr><th>Código</th><th>Tipo</th><th>Nivel</th><th>Padre</th><th>Enunciado</th><th>Origen</th></tr>
        </thead>
        <tbody>
          {objList.map(o => (
            <tr key={o.codigo}>
              <td><strong>{o.codigo}</strong></td>
              <td><span className={pillClass(o.tipo)}>{o.tipo}</span></td>
              <td>{o.nivel === 0 ? "Central" : `Nivel ${o.nivel}`}</td>
              <td><strong>{o.padre}</strong></td>
              <td>{o.enunciado}</td>
              <td><small>{o.origen}</small></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="tree-container-wrap">
        <div className="tree-toolbar">
          <div>🌳 Árbol de Objetivos y Resultados (Medios y Fines · SmartArt)</div>
          <div className="smart-tree-legend">
            <span className="legend-item">F2 · Fin indirecto</span>
            <span className="legend-item">F1 · Fin directo</span>
            <span className="legend-item">Obj_P · Propósito Central</span>
            <span className="legend-item">M1 · Medio directo</span>
            <span className="legend-item">M2 · Medio indirecto</span>
            <span className="legend-item">M3 · Medio fundamental</span>
          </div>
        </div>

        <div className="smart-tree-viewport">
          <div className="smart-tree">
            <div className="tree-section-title">▲ Fines del Proyecto (Impacto positivo de largo plazo)</div>
            <div className="effects-cluster">
              {f1Nodes.map(f1 => {
                const f2Children = objList.filter(o => o.padre === f1.codigo);
                return (
                  <div className="tree-branch" key={f1.codigo}>
                    <div className="tree-sub-children">
                      {f2Children.map(f2 => <SmartNode key={f2.codigo} node={f2} levelClass="level-f2" levelTag="Fin indirecto (N2)" />)}
                    </div>
                    <SmartNode node={f1} levelClass="level-f1" levelTag="Fin directo (N1)" />
                  </div>
                );
              })}
            </div>

            <div className="tree-connector-down" />

            <div className="smart-node level-objp" style={{ margin: "8px 0" }}>
              <div className="smart-node-head">
                <span className="smart-node-code">Obj_P</span>
                <span className="smart-node-level-tag">PROPÓSITO CENTRAL / OBJETIVO GENERAL</span>
              </div>
              <p className="smart-node-text">{objP.enunciado}</p>
              <div className="smart-node-footer" style={{ justifyContent: "center", gap: 12 }}>
                <span>Población: <strong>{caso.caso.poblacion || "Jóvenes rurales"}</strong></span>
                <span>Territorio: <strong>{caso.caso.municipio || "Manizales"}</strong></span>
              </div>
            </div>

            <div className="tree-connector-down" />
            <div className="tree-section-title">▼ Medios de Intervención (Componentes y Actividades)</div>
            <div className="causes-cluster">
              {m1Nodes.map(m1 => {
                const m2Children = objList.filter(o => o.padre === m1.codigo)
                  .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), "es", { numeric: true }));
                return (
                  <div className="tree-branch" key={m1.codigo}>
                    <div className="tree-branch-header">
                      <SmartNode node={m1} levelClass="level-m1" levelTag="Medio directo (N1)" />
                    </div>
                    {m2Children.length > 0 && (
                      <div className="tree-branch-children">
                        {m2Children.map(m2 => {
                          const m3Children = objList.filter(o => o.padre === m2.codigo)
                            .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), "es", { numeric: true }));
                          return (
                            <div className="tree-leaf-cluster" key={m2.codigo}>
                              <SmartNode node={m2} levelClass="level-m2" levelTag="Medio indirecto (N2)" />
                              {m3Children.length > 0 && (
                                <div className="tree-sub-children">
                                  {m3Children.map(m3 => <SmartNode key={m3.codigo} node={m3} levelClass="level-m3" levelTag="Medio fundamental (N3)" />)}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}