import { useState } from "react";
import { useCasoContext } from "../context/casoContext.jsx";
import {
  runProblemValidation,
  resumenValidacion,
  estadoPrueba,
  etiquetaPrueba,
} from "../utils/validacionArbolProblema.js";

const FORM_EXTERNA_INICIAL = {
  recognized: "",
  rejected: "",
  missing: "",
  source: "",
  observations: "",
};

const DECISION_LABELS = {
  aprobado: "Árbol consistente",
  ajustes: "Requiere ajustes",
  pendiente: "Validación pendiente",
};

export function ProblemaValidacion() {
  const { caso, registrarBitacora } = useCasoContext();

  const [tests, setTests] = useState(null);
  const [formExterna, setFormExterna] = useState(FORM_EXTERNA_INICIAL);
  const [externalNotice, setExternalNotice] = useState(false);
  const [decision, setDecision] = useState("");
  const [decisionNotice, setDecisionNotice] = useState("");

  const resumen = tests ? resumenValidacion(tests) : null;

  function actualizarFormExterna(campo, valor) {
    setFormExterna(prev => ({ ...prev, [campo]: valor }));
  }

  function ejecutarValidacion() {
    setTests(runProblemValidation(caso.nodos));
  }

  function saveProblemExternalValidation() {
    const recognized = formExterna.recognized.trim();
    const rejected = formExterna.rejected.trim();
    const missing = formExterna.missing.trim();
    const source = formExterna.source;
    const observations = formExterna.observations.trim();

    if (!recognized && !rejected && !missing && !observations) {
      alert("Registra al menos un resultado de la validación.");
      return;
    }

    /*
     * La validación externa se conserva en la bitácora
     * del artefacto, sin guardar nombres ni datos personales.
     */
    registrarBitacora({
      patron: "Validación externa del árbol",
      salida: [
        source ? "Modalidad: " + source : "",
        recognized ? "Reconocidos: " + recognized : "",
        rejected ? "No reconocidos: " + rejected : "",
        missing ? "Faltantes: " + missing : "",
      ]
        .filter(Boolean)
        .join("\n"),
      correccion: observations || "Sin corrección registrada.",
    });

    setExternalNotice(true);
  }

  function saveProblemValidationDecision() {
    if (!decision) {
      alert("Selecciona el estado de cierre de la validación.");
      return;
    }

    registrarBitacora({
      patron: "Cierre de validación metodológica",
      salida: "Decisión: " + DECISION_LABELS[decision],
      correccion:
        decision === "aprobado"
          ? "El formulador considera que el árbol puede continuar."
          : decision === "ajustes"
            ? "El árbol debe ser corregido antes de continuar."
            : "La validación aún no es suficiente.",
    });

    setDecisionNotice(DECISION_LABELS[decision]);
  }

  return (
    <div className="problem-subscreen active">
      <div className="card">
        <div className="section-head">
          <div>
            <h3>5. Validación metodológica</h3>
            <p>
              Revisa la consistencia lógica del árbol antes de continuar. Las pruebas automáticas
              identifican hallazgos estructurales; la decisión metodológica final corresponde al formulador.
            </p>
          </div>

          <button type="button" className="btn primary" onClick={ejecutarValidacion}>
            Ejecutar validación
          </button>
        </div>

        <div className={`problem-validation-summary ${resumen ? resumen.summaryClass : ""}`}>
          {resumen ? (
            <>
              <div>
                <strong>{resumen.summaryTitle}</strong>
                <span>{resumen.summaryText}</span>
              </div>

              <div className="problem-validation-counter">
                <span>✓ {resumen.passed}</span>
                <span>! {resumen.pending}</span>
                <span>✕ {resumen.failed}</span>
              </div>
            </>
          ) : (
            <div>
              <strong>Validación pendiente</strong>
              <span>Ejecuta las cinco pruebas sobre el árbol construido.</span>
            </div>
          )}
        </div>

        <div className="problem-validation-grid">
          {!tests ? (
            <div className="notice">Las pruebas de validez se ejecutarán sobre el árbol construido.</div>
          ) : (
            tests.map(test => {
              const status = estadoPrueba(test);

              return (
                <div className={`problem-validation-item ${status}`} key={test.key}>
                  <div className="problem-validation-item-head">
                    <div>
                      <span className={`problem-validation-status ${status}`}>{etiquetaPrueba(test)}</span>
                      <h4>{test.title}</h4>
                    </div>
                  </div>

                  <p className="problem-validation-question">{test.question}</p>

                  {test.ok ? (
                    <div className="problem-validation-message">
                      ✓ No se encontraron hallazgos automáticos.
                    </div>
                  ) : test.pending ? (
                    <div className="problem-validation-message pending">
                      {test.details.map((detail, i) => (
                        <div key={i}>{detail}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="problem-validation-findings">
                      <strong>Hallazgos</strong>
                      <ul>
                        {test.details.map((detail, i) => (
                          <li key={i}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* VALIDACIÓN EXTERNA */}
      <div className="card">
        <div className="section-head">
          <div>
            <h3>Validación con evidencia e involucrados</h3>
            <p>
              La validación automática no sustituye la confrontación del árbol con quienes conocen o viven
              el problema.
            </p>
          </div>
        </div>

        <div className="notice">
          <strong>Regla metodológica:</strong> registre qué nodos son reconocidos, cuáles no son reconocidos
          y qué elementos consideran que hacen falta. Si no es posible realizar contacto directo, documente
          explícitamente la validación mediante fuentes secundarias.
        </div>

        <div className="grid" style={{ marginTop: 16 }}>
          <div className="field span-4">
            <label htmlFor="validationRecognized">Nodos reconocidos</label>
            <textarea id="validationRecognized"
              placeholder="Códigos o elementos del árbol que los involucrados reconocen como parte del problema."
              value={formExterna.recognized}
              onChange={e => actualizarFormExterna("recognized", e.target.value)} />
          </div>

          <div className="field span-4">
            <label htmlFor="validationRejected">Nodos no reconocidos</label>
            <textarea id="validationRejected"
              placeholder="Códigos o elementos que fueron cuestionados o no reconocidos."
              value={formExterna.rejected}
              onChange={e => actualizarFormExterna("rejected", e.target.value)} />
          </div>

          <div className="field span-4">
            <label htmlFor="validationMissing">Nodos o relaciones faltantes</label>
            <textarea id="validationMissing"
              placeholder="Causas, efectos o relaciones que los involucrados consideran ausentes."
              value={formExterna.missing}
              onChange={e => actualizarFormExterna("missing", e.target.value)} />
          </div>

          <div className="field span-6">
            <label htmlFor="validationSource">Modalidad / fuente de validación</label>
            <select id="validationSource" value={formExterna.source}
              onChange={e => actualizarFormExterna("source", e.target.value)}>
              <option value="">Seleccione...</option>
              <option value="Consulta directa">Consulta directa con involucrados</option>
              <option value="Taller participativo">Taller participativo</option>
              <option value="Entrevistas">Entrevistas</option>
              <option value="Fuentes secundarias">Fuentes secundarias</option>
              <option value="Pendiente">Pendiente</option>
            </select>
          </div>

          <div className="field span-6">
            <label htmlFor="validationObservations">Observaciones y decisiones</label>
            <textarea id="validationObservations" placeholder="¿Qué se mantiene, qué se corrige y por qué?"
              value={formExterna.observations}
              onChange={e => actualizarFormExterna("observations", e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <button type="button" className="btn" onClick={saveProblemExternalValidation}>
            Registrar validación externa
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {externalNotice && (
            <div className="notice success">
              <strong>✓ Validación registrada</strong>
              <div style={{ marginTop: 4 }}>
                El resultado quedó incorporado a la bitácora para conservar la trazabilidad de la revisión.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DECISIÓN DE CIERRE */}
      <div className="card">
        <div className="section-head">
          <div>
            <h3>Cierre de la validación</h3>
            <p>
              La validación no modifica automáticamente los nodos. Los hallazgos deben llevar a una
              corrección deliberada del árbol.
            </p>
          </div>
        </div>

        <div className="validation-decision">
          <label className="validation-radio">
            <input type="radio" name="problemValidationDecision" value="aprobado"
              checked={decision === "aprobado"} onChange={e => setDecision(e.target.value)} />
            <span>
              <strong>Árbol consistente</strong>
              <small>Las pruebas y la confrontación no presentan hallazgos pendientes relevantes.</small>
            </span>
          </label>

          <label className="validation-radio">
            <input type="radio" name="problemValidationDecision" value="ajustes"
              checked={decision === "ajustes"} onChange={e => setDecision(e.target.value)} />
            <span>
              <strong>Requiere ajustes</strong>
              <small>Existen hallazgos que deben corregirse antes de avanzar.</small>
            </span>
          </label>

          <label className="validation-radio">
            <input type="radio" name="problemValidationDecision" value="pendiente"
              checked={decision === "pendiente"} onChange={e => setDecision(e.target.value)} />
            <span>
              <strong>Validación pendiente</strong>
              <small>Aún falta evidencia o confrontación suficiente.</small>
            </span>
          </label>
        </div>

        <div style={{ marginTop: 14 }}>
          <button type="button" className="btn primary" onClick={saveProblemValidationDecision}>
            Guardar decisión
          </button>
        </div>

        <div style={{ marginTop: 12 }}>
          {decisionNotice && (
            <div className="notice success">
              <strong>✓ Decisión registrada</strong>
              <div style={{ marginTop: 4 }}>{decisionNotice}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
