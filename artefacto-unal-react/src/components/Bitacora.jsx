import { useState } from "react";
import { useCasoContext } from "../context/casoContext.jsx";
import { formatProblemLogDate, etiquetaConteoRegistros } from "../utils/bitacoraProblema.js";

const FORM_INICIAL = {
  logPattern: "",
  logPrompt: "",
  logOutput: "",
  logError: "",
  logDetection: "",
  logCorrection: "",
};

export function Bitacora() {
  const { caso, setCaso, registrarBitacora } = useCasoContext();
  const [form, setForm] = useState(FORM_INICIAL);
  const [logNotice, setLogNotice] = useState(false);

  const logs = Array.isArray(caso.bitacora) ? caso.bitacora : [];

  function actualizarForm(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
  }

  function clearProblemLogForm() {
    setForm(FORM_INICIAL);
  }

  function addProblemLog() {
    const pattern = form.logPattern.trim();
    const prompt = form.logPrompt.trim();
    const output = form.logOutput.trim();
    const error = form.logError.trim();
    const detection = form.logDetection.trim();
    const correction = form.logCorrection.trim();

    if (!pattern || !prompt || !output || !error || !correction) {
      alert("Completa propósito, prompt, salida, error y corrección humana.");
      return;
    }

    registrarBitacora({
      patron: "Paso 2 · " + pattern,
      prompt,
      salida: output,
      error,
      comoSeDetecto: detection,
      correccion: correction,
    });

    clearProblemLogForm();
    setLogNotice(true);
  }

  function deleteProblemLog(index) {
    if (!Array.isArray(caso.bitacora) || !caso.bitacora[index]) {
      return;
    }

    if (!confirm("¿Desea eliminar este registro de la bitácora?")) {
      return;
    }

    setCaso(prev => ({
      ...prev,
      bitacora: prev.bitacora.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="problem-subscreen active">
      <div className="card">
        <div className="section-head">
          <div>
            <h3>7. Bitácora de uso de IA</h3>
            <p>
              Registra cómo se utilizó la inteligencia artificial, qué produjo, qué se detectó y qué decisión
              tomó el formulador.
            </p>
          </div>
        </div>

        <div className="notice">
          <strong>Uso crítico de IA:</strong> una bitácora sin errores o correcciones no demuestra
          verificación. Las propuestas del modelo deben ser contrastadas antes de incorporarse al proyecto.
        </div>

        <div className="grid" style={{ marginTop: 16 }}>
          <div className="field span-4">
            <label htmlFor="logPattern">Propósito / tarea *</label>
            <input id="logPattern" type="text" placeholder="Ej. Depurar problema central"
              value={form.logPattern} onChange={e => actualizarForm("logPattern", e.target.value)} />
          </div>

          <div className="field span-8">
            <label htmlFor="logPrompt">Prompt empleado (resumen) *</label>
            <textarea id="logPrompt" placeholder="Resume la instrucción utilizada con el modelo."
              value={form.logPrompt} onChange={e => actualizarForm("logPrompt", e.target.value)} />
          </div>

          <div className="field span-6">
            <label htmlFor="logOutput">¿Qué produjo el modelo? *</label>
            <textarea id="logOutput"
              placeholder="Resume la salida relevante del modelo, indicando que se trata de una propuesta."
              value={form.logOutput} onChange={e => actualizarForm("logOutput", e.target.value)} />
          </div>

          <div className="field span-6">
            <label htmlFor="logError">¿Qué produjo mal el modelo? *</label>
            <textarea id="logError"
              placeholder="Describe el error, inconsistencia, dato no sustentado o problema metodológico detectado."
              value={form.logError} onChange={e => actualizarForm("logError", e.target.value)} />
          </div>

          <div className="field span-6">
            <label htmlFor="logDetection">¿Cómo se detectó?</label>
            <textarea id="logDetection"
              placeholder="Prueba, comparación con fuente, revisión metodológica, contraste con involucrados, etc."
              value={form.logDetection} onChange={e => actualizarForm("logDetection", e.target.value)} />
          </div>

          <div className="field span-6">
            <label htmlFor="logCorrection">Corrección humana *</label>
            <textarea id="logCorrection" placeholder="Qué se aceptó, descartó o corrigió y por qué."
              value={form.logCorrection} onChange={e => actualizarForm("logCorrection", e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="btn primary" onClick={addProblemLog}>
            Agregar registro
          </button>

          <button type="button" className="btn" onClick={clearProblemLogForm}>
            Limpiar
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {logNotice && (
            <div className="notice success">
              <strong>✓ Registro agregado</strong>
              <div style={{ marginTop: 4 }}>La intervención quedó incorporada a la bitácora.</div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="section-head">
          <div>
            <h3>Registros de la bitácora</h3>
            <p>
              Los registros se conservan dentro del estado del proyecto y posteriormente podrán exportarse
              junto con el JSON.
            </p>
          </div>

          <span id="problemLogCount" className="badge">{etiquetaConteoRegistros(logs.length)}</span>
        </div>

        {!logs.length ? (
          <div className="notice">Aún no hay registros de bitácora.</div>
        ) : (
          <div className="problem-log-list">
            {logs.map((log, index) => (
              <article className="problem-log-entry" key={index}>
                <div className="problem-log-entry-head">
                  <div>
                    <span className="badge">#{index + 1}</span>
                    <strong>{log.patron || "Intervención IA"}</strong>
                  </div>

                  <span className="problem-log-date">{formatProblemLogDate(log.fecha)}</span>
                </div>

                <div className="problem-log-grid">
                  <div>
                    <label>Prompt empleado</label>
                    <div className="problem-log-content">{log.prompt || "No registrado"}</div>
                  </div>

                  <div>
                    <label>Salida del modelo</label>
                    <div className="problem-log-content proposal">
                      <span className="badge warning">Propuesta</span>
                      <div style={{ marginTop: 6 }}>{log.salida || "No registrada"}</div>
                    </div>
                  </div>

                  <div>
                    <label>Qué produjo mal</label>
                    <div className="problem-log-content error">{log.error || "No registrado"}</div>
                  </div>

                  <div>
                    <label>Cómo se detectó</label>
                    <div className="problem-log-content">{log.comoSeDetecto || "No registrado"}</div>
                  </div>

                  <div className="problem-log-correction">
                    <label>Corrección humana</label>
                    <div className="problem-log-content correction">
                      {log.correccion || "No registrada"}
                    </div>
                  </div>
                </div>

                <div className="problem-log-actions">
                  <button type="button" className="btn-mini" onClick={() => deleteProblemLog(index)}>
                    Eliminar registro
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
