import { useState } from "react";
import { useCasoContext } from "../context/casoContext.jsx";
import { SmartNode } from "./SmartNode.jsx";
import { buildEAPFromTree } from "../utils/validarArbol.js";

const PROBLEMA_DEFECTO = "Dificultades para consolidar oportunidades laborales y productivas suficientemente atractivas para favorecer la permanencia de los jóvenes en la zona rural de Manizales.";

export function ArbolVisual() {
  const { caso } = useCasoContext();
  const [modo, setModo] = useState("smartart");

  const p = caso.problema.central || PROBLEMA_DEFECTO;
  const nodes = caso.nodos || [];

  const toolbar = (
    <div className="tree-toolbar">
      <div className="tree-view-tabs">
        <button className={`tree-tab-btn ${modo === "smartart" ? "active" : ""}`} onClick={() => setModo("smartart")}>
          🌳 Árbol Jerárquico SmartArt
        </button>
        <button className={`tree-tab-btn ${modo === "eap_mapping" ? "active" : ""}`} onClick={() => setModo("eap_mapping")}>
          📋 Correspondencia Árbol ↔ EAP
        </button>
        <button className={`tree-tab-btn ${modo === "levels" ? "active" : ""}`} onClick={() => setModo("levels")}>
          📑 Vista por Niveles CEPAL
        </button>
      </div>
      <div className="smart-tree-legend">
        <span className="legend-item legend-e2">E2 · Efecto indirecto</span>
        <span className="legend-item legend-e1">E1 · Efecto directo</span>
        <span className="legend-item legend-p">P · Problema central</span>
        <span className="legend-item legend-c1">C1 · Causa directa</span>
        <span className="legend-item legend-c2">C2 · Causa indirecta</span>
        <span className="legend-item legend-c3">C3 · Causa raíz</span>
      </div>
    </div>
  );

  // ---------- Vista: Correspondencia Árbol ↔ EAP ----------
  if (modo === "eap_mapping") {
    const eap = buildEAPFromTree(caso);
    const componentes = eap?.componentes || [];

    return (
      <div className="tree-container-wrap">
        {toolbar}
        <div className="notice">
          <strong>Metodología CEPAL/ILPES:</strong> Las <strong>Causas Directas (C1)</strong> se transforman en <strong>Componentes</strong> del proyecto, mientras que las <strong>Causas Raíz (C3/C4)</strong> se convierten en <strong>Actividades operativas</strong> concretas (3 a 4 actividades por componente).
        </div>
        <div className="eap-mapping-container">
          {componentes.map((comp, idx) => {
            const cause = nodes.find(n => n.codigo === comp.causa_asociada || n.codigo === `C1.${idx + 1}`);
            const roots = nodes.filter(n =>
              n.tipo === "causa" && Number(n.nivel) >= 3 &&
              (n.padre.startsWith(`C2.${idx * 2 + 1}`) || n.padre.startsWith(`C2.${idx * 2 + 2}`) || n.padre.startsWith(`C1.${idx + 1}`))
            );
            return (
              <div className="eap-map-card" key={comp.codigo}>
                <div className="eap-map-head">
                  <span className="eap-comp-badge">{comp.codigo}</span>
                  <div>
                    <strong>{comp.nombre}</strong>
                    <span className="eap-cause-tag">
                      Derivado de Causa: {cause ? `${cause.codigo} · ${cause.enunciado}` : comp.causa_asociada || `C1.${idx + 1}`}
                    </span>
                  </div>
                </div>
                <div>
                  <strong>Causas raíz intervenidas en el árbol:</strong>
                  <ul>
                    {roots.length
                      ? roots.map(r => <li key={r.codigo}><strong>{r.codigo}:</strong> {r.enunciado}</li>)
                      : <li>Causas raíz de la rama C1.{idx + 1}</li>}
                  </ul>
                </div>
                <div>
                  <strong>Actividades operativas formuladas ({(comp.actividades || []).length} actividades):</strong>
                  <ol className="eap-act-list">
                    {(comp.actividades || []).map((act, i) => <li key={i}>{act}</li>)}
                  </ol>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------- Vista: Por Niveles CEPAL ----------
  if (modo === "levels") {
    const byTypeLevel = (type, level) =>
      nodes.filter(n => n.tipo === type && Number(n.nivel) === level)
        .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), "es", { numeric: true }));
    const maxLevel = type => Math.max(1, ...nodes.filter(n => n.tipo === type).map(n => Number(n.nivel) || 1));

    const Cards = ({ items, type }) =>
      items.length ? (
        items.map(n => (
          <div className={`tree-node ${type} level-${Number(n.nivel) || 1}`} key={n.codigo}>
            <b>{n.codigo}</b>
            <span>{n.enunciado}</span>
            <small>Padre: {n.padre || "P"}</small>
          </div>
        ))
      ) : (
        <div className="tree-node empty-node">Sin nodos registrados en este nivel</div>
      );

    const LevelRow = ({ type, level, label }) => (
      <div className={`tree-level ${type} level-${level}`}>
        <div className="tree-level-label">{label}</div>
        <div className="tree-row"><Cards items={byTypeLevel(type, level)} type={type} /></div>
      </div>
    );

    const maxEfecto = maxLevel("efecto");
    const maxCausa = maxLevel("causa");

    return (
      <div className="tree-container-wrap">
        {toolbar}
        <div style={{ overflowX: "auto" }}>
          {Array.from({ length: maxEfecto }, (_, i) => maxEfecto - i).map(level => (
            <LevelRow key={`efecto-${level}`} type="efecto" level={level}
              label={level === 1 ? "Efectos directos (Nivel 1)" : `Efectos indirectos (Nivel ${level})`} />
          ))}
          <div className="arrow" style={{ textAlign: "center" }}>↓</div>
          <div className="tree-row problem-row" style={{ display: "flex", justifyContent: "center" }}>
            <div className="smart-node level-p">
              <div className="smart-node-head">
                <span className="smart-node-code">P</span>
                <span className="smart-node-level-tag">PROBLEMA CENTRAL</span>
              </div>
              <p className="smart-node-text">{p}</p>
            </div>
          </div>
          <div className="arrow" style={{ textAlign: "center" }}>↓</div>
          {Array.from({ length: maxCausa }, (_, i) => i + 1).map(level => (
            <LevelRow key={`causa-${level}`} type="causa" level={level}
              label={level === 1 ? "Causas directas (Nivel 1)" : level === maxCausa ? `Causas raíz (Nivel ${level})` : `Causas indirectas (Nivel ${level})`} />
          ))}
        </div>
      </div>
    );
  }

  // ---------- Vista por defecto: SmartArt jerárquico ----------
  const e1Nodes = nodes.filter(n => n.tipo === "efecto" && Number(n.nivel) === 1);
  const c1Nodes = nodes.filter(n => n.tipo === "causa" && Number(n.nivel) === 1)
    .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), "es", { numeric: true }));

  return (
    <div className="tree-container-wrap">
      {toolbar}
      <div className="smart-tree-viewport">
        <div className="smart-tree">
          <div className="tree-section-title title-effects">▲ Consecuencias y Efectos (Arriba)</div>
          <div className="effects-cluster">
            {e1Nodes.length ? e1Nodes.map(e1 => {
              const e2Children = nodes.filter(n => n.tipo === "efecto" && n.padre === e1.codigo);
              return (
                <div className="tree-branch" key={e1.codigo}>
                  <div className="tree-sub-children">
                    {e2Children.map(e2 => <SmartNode key={e2.codigo} node={e2} levelClass="level-e2" levelTag="Efecto indirecto (N2)" />)}
                  </div>
                  <SmartNode node={e1} levelClass="level-e1" levelTag="Efecto directo (N1)" />
                </div>
              );
            }) : <div className="smart-node level-e1"><p className="smart-node-text">No hay efectos registrados.</p></div>}
          </div>

          <div className="tree-connector-down" />

          <div className="smart-node level-p" style={{ margin: "8px 0" }}>
            <div className="smart-node-head">
              <span className="smart-node-code">P</span>
              <span className="smart-node-level-tag">PROBLEMA CENTRAL (VALIDADO)</span>
            </div>
            <p className="smart-node-text">{p}</p>
            <div className="smart-node-footer" style={{ justifyContent: "center", gap: 12, color: "#991b1b" }}>
              <span>Población: <strong>{caso.caso.poblacion || "Jóvenes rurales"}</strong></span>
              <span>Territorio: <strong>{caso.caso.municipio || "Manizales"}</strong></span>
            </div>
          </div>

          <div className="tree-connector-down" />
          <div className="tree-section-title title-causes">▼ Causas y Raíces Explicativas (Abajo)</div>
          <div className="causes-cluster">
            {c1Nodes.length ? c1Nodes.map(c1 => {
              const c2Children = nodes.filter(n => n.tipo === "causa" && n.padre === c1.codigo)
                .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), "es", { numeric: true }));
              return (
                <div className="tree-branch" key={c1.codigo}>
                  <div className="tree-branch-header">
                    <SmartNode node={c1} levelClass="level-c1" levelTag="Causa directa (N1)" />
                  </div>
                  {c2Children.length > 0 && (
                    <div className="tree-branch-children">
                      {c2Children.map(c2 => {
                        const c3Children = nodes.filter(n => n.tipo === "causa" && n.padre === c2.codigo)
                          .sort((a, b) => String(a.codigo).localeCompare(String(b.codigo), "es", { numeric: true }));
                        return (
                          <div className="tree-leaf-cluster" key={c2.codigo}>
                            <SmartNode node={c2} levelClass="level-c2" levelTag="Causa indirecta (N2)" />
                            {c3Children.length > 0 && (
                              <div className="tree-sub-children">
                                {c3Children.map(c3 => <SmartNode key={c3.codigo} node={c3} levelClass="level-c3" levelTag="Causa raíz (N3)" />)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }) : <div className="smart-node level-c1"><p className="smart-node-text">No hay causas registradas.</p></div>}
          </div>
        </div>
      </div>
    </div>
  );
}