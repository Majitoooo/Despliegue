import { useState } from "react";
import { useCasoContext } from "../context/casoContext.jsx";
import { nextNodeCode } from "../utils/nodosArbol.js";

const FORM_INICIAL = {
  tipo: "causa", nivel: "1", padre: "P", enunciado: "",
  evidencia: "", lineaBase: "", confianza: "Media", origen: "Formulador",
};

export function EfectosCausas() {
  const { caso, setCaso } = useCasoContext();
  const [form, setForm] = useState(FORM_INICIAL);

  const nodosValidosComoPadre = caso.nodos.filter(n => n && n.codigo && n.codigo !== "P");
  const efectos = caso.nodos.filter(n => n && n.tipo === "efecto");
  const causas = caso.nodos.filter(n => n && n.tipo === "causa");

  function actualizarForm(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
  }

  function agregarNodo() {
    const { tipo, enunciado, evidencia, lineaBase, confianza, origen } = form;
    const level = Number(form.nivel);
    const parent = form.padre || "P";
    const statement = enunciado.trim();

    if (!statement) { alert("Escribe el enunciado del nodo."); return; }

    const actionPattern = /^(capacitar|crear|construir|implementar|diseñar|desarrollar|fortalecer|promover|realizar|ejecutar)\b/i;
    if (actionPattern.test(statement)) {
      alert("El nodo parece estar redactado como una acción o solución.\n\nReescríbelo como un estado negativo observable.");
      return;
    }

    const duplicate = caso.nodos.some(n => n && String(n.enunciado || "").trim().toLowerCase() === statement.toLowerCase());
    if (duplicate) { alert("Ya existe un nodo con el mismo enunciado."); return; }

    if (level > 1 && parent === "P") {
      const previousLevelExists = caso.nodos.some(n => n && n.tipo === tipo && Number(n.nivel) === level - 1);
      if (previousLevelExists) {
        alert(`Para un nodo de nivel ${level}, selecciona un padre del nivel anterior.`);
        return;
      }
    }

    const nuevoNodo = {
      codigo: nextNodeCode(caso.nodos, tipo, level),
      tipo, nivel: level, padre: parent, enunciado: statement,
      evidencia: evidencia.trim(), lineaBase: lineaBase.trim(),
      confianza: origen === "Propuesta IA" ? "Baja" : confianza,
      origen,
    };

    setCaso(prev => ({ ...prev, nodos: [...prev.nodos, nuevoNodo] }));
    setForm(prev => ({ ...prev, enunciado: "", evidencia: "", lineaBase: "" }));
  }

  function eliminarNodo(codigo) {
    if (codigo === "P") { alert("El problema central se modifica desde la sección 2.2."); return; }
    if (!confirm(`¿Desea eliminar el nodo ${codigo}?`)) return;

    setCaso(prev => ({
      ...prev,
      nodos: prev.nodos
        .filter(n => n.codigo !== codigo)
        .map(n => n.padre === codigo ? { ...n, padre: "P" } : n),
    }));
  }

  function NodeCard({ node }) {
    const origin = node.origen === "Propuesta IA" ? "Propuesta IA" : "Formulador";
    return (
      <div className="card" style={{ marginTop: 10, borderLeft: `4px solid ${node.tipo === "causa" ? "#8b5e34" : "#4b6b8a"}` }}>
        <div className="section-head">
          <div>
            <div><strong>{node.codigo}</strong> <span className="pill">{node.tipo === "causa" ? "Causa" : "Efecto"}</span></div>
            <h4 style={{ marginTop: 7 }}>{node.enunciado}</h4>
          </div>
          <button type="button" className="btn-mini" onClick={() => eliminarNodo(node.codigo)}>Eliminar</button>
        </div>
        <div className="small-note">Nivel {node.nivel} · Padre {node.padre || "P"} · {origin} · Confianza {node.confianza || "Baja"}</div>
        <div style={{ marginTop: 8, display: "grid", gap: 5 }}>
          <div className="small-note"><strong>Evidencia:</strong> {node.evidencia || "Pendiente"}</div>
          <div className="small-note"><strong>Línea base:</strong> {node.lineaBase || "Pendiente"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="problem-subscreen active">
      <div className="card">
        <div className="section-head">
          <div>
            <h3>3. Efectos y causas</h3>
            <p>Registra los nodos del árbol de problemas. Cada nodo debe representar un estado negativo y conservar evidencia, línea base y nivel de confianza.</p>
          </div>
        </div>

        <div className="grid">
          <div className="field span-3">
            <label htmlFor="nodeType">Tipo de nodo *</label>
            <select id="nodeType" value={form.tipo} onChange={e => actualizarForm("tipo", e.target.value)}>
              <option value="causa">Causa</option>
              <option value="efecto">Efecto</option>
            </select>
          </div>
          <div className="field span-3">
            <label htmlFor="nodeLevel">Nivel *</label>
            <select id="nodeLevel" value={form.nivel} onChange={e => actualizarForm("nivel", e.target.value)}>
              <option value="1">1 · Directo</option>
              <option value="2">2 · Indirecto</option>
              <option value="3">3 · Profundización</option>
              <option value="4">4 · Raíz / final</option>
            </select>
          </div>
          <div className="field span-6">
            <label htmlFor="nodeParent">Nodo padre *</label>
            <select id="nodeParent" value={form.padre} onChange={e => actualizarForm("padre", e.target.value)}>
              <option value="P">P · Problema central</option>
              {nodosValidosComoPadre.map(n => (
                <option key={n.codigo} value={n.codigo}>{n.codigo} · {n.enunciado}</option>
              ))}
            </select>
          </div>
          <div className="field span-12">
            <label htmlFor="nodeStatement">Enunciado del nodo *</label>
            <textarea id="nodeStatement" placeholder="Ejemplo: Baja disponibilidad de oportunidades laborales para jóvenes rurales."
              value={form.enunciado} onChange={e => actualizarForm("enunciado", e.target.value)} />
          </div>
          <div className="field span-6">
            <label htmlFor="nodeEvidence">Evidencia</label>
            <textarea id="nodeEvidence" placeholder="Fuente o evidencia que respalda el nodo."
              value={form.evidencia} onChange={e => actualizarForm("evidencia", e.target.value)} />
          </div>
          <div className="field span-6">
            <label htmlFor="nodeBaseline">Línea base</label>
            <textarea id="nodeBaseline" placeholder="Dato actual disponible o pendiente de consolidar."
              value={form.lineaBase} onChange={e => actualizarForm("lineaBase", e.target.value)} />
          </div>
          <div className="field span-4">
            <label htmlFor="nodeConfidence">Confianza</label>
            <select id="nodeConfidence" value={form.confianza} onChange={e => actualizarForm("confianza", e.target.value)}>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          <div className="field span-8">
            <label htmlFor="nodeOrigin">Origen</label>
            <select id="nodeOrigin" value={form.origen} onChange={e => actualizarForm("origen", e.target.value)}>
              <option value="Formulador">Formulador</option>
              <option value="Propuesta IA">Propuesta IA</option>
            </select>
          </div>
        </div>

        <div className="notice" style={{ marginTop: 16 }}>
          Los problemas percibidos por los involucrados son insumos para el análisis. No se convierten automáticamente en causas ni en efectos.
        </div>

        <div style={{ marginTop: 16 }}>
          <button type="button" className="btn primary" onClick={agregarNodo}>+ Agregar nodo</button>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card span-6">
          <div className="section-head">
            <div><h3>Efectos registrados</h3><p className="small-note">Consecuencias que se derivan del problema central.</p></div>
          </div>
          {efectos.length ? efectos.map(n => <NodeCard key={n.codigo} node={n} />) : <div className="notice">Aún no hay efectos registrados.</div>}
        </div>

        <div className="card span-6">
          <div className="section-head">
            <div><h3>Causas registradas</h3><p className="small-note">Factores que explican el problema central.</p></div>
          </div>
          {causas.length ? causas.map(n => <NodeCard key={n.codigo} node={n} />) : <div className="notice">Aún no hay causas registradas.</div>}
        </div>
      </div>
    </div>
  );
}