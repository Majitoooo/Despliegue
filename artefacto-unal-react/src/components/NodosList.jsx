import { useCasoContext } from "../context/casoContext.jsx";
import { validarArbol } from "../utils/validarArbol.js";

function nivelLabel(n) {
  if (n.tipo === "causa") {
    return n.nivel === 1 ? "Causa directa (Nivel 1)" : n.nivel === 2 ? "Causa indirecta (Nivel 2)" : `Causa raíz (Nivel ${n.nivel})`;
  }
  return n.nivel === 1 ? "Efecto directo (Nivel 1)" : `Efecto indirecto (Nivel ${n.nivel})`;
}

export function NodosList() {
  const { caso, setCaso } = useCasoContext();
  const nodos = caso.nodos || [];
  const validacion = validarArbol(caso);

  function eliminarNodo(index) {
    setCaso(prev => ({ ...prev, nodos: prev.nodos.filter((_, i) => i !== index) }));
  }

  return (
    <div>
      <h3>{nodos.length} nodos</h3>

      {nodos.length === 0 ? (
        <div className="empty">No hay nodos en el árbol. Construye las causas y efectos o carga el árbol revisado CEPAL.</div>
      ) : (
        nodos.map((n, i) => (
          <div className={`node-card ${n.origen === "Propuesta IA" ? "ai" : "human"}`} key={n.codigo + i}>
            <div className="section-head">
              <div>
                <span className="code">{n.codigo}</span>
                <h4 style={{ display: "inline-block", marginLeft: 8 }}>{n.enunciado}</h4>
                <div className="node-meta">
                  {n.tipo === "causa" ? "Causa" : "Efecto"} · {nivelLabel(n)} · Conectado al padre: <strong>{n.padre || "P"}</strong>
                </div>
              </div>
              <button onClick={() => eliminarNodo(i)}>Eliminar</button>
            </div>
            <p><strong>Evidencia:</strong> {n.evidencia || "Pendiente"} · <strong>Línea base:</strong> {n.lineaBase || "Pendiente"}</p>
          </div>
        ))
      )}

      <h3>Validación del árbol</h3>
      {validacion.map(test => (
        <div className={`vitem ${test.ok ? "ok" : "bad"}`} key={test.titulo}>
          <strong>{test.ok ? "✓" : "✕"} {test.titulo}</strong>
          <div className="small-note">{test.mensaje}</div>
          {test.nodos.length > 0 && (
            <div className="small-note" style={{ color: "#b91c1c" }}>
              <strong>Revisar nodos:</strong> {test.nodos.join(", ")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}