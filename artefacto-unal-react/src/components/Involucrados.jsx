import { useState } from "react";
import { useCasoContext } from "../context/casoContext.jsx";
import {
  normalizeLines, actorPositionClass, actorPositionLabel,
  actorQuadrant, calculateActorResult, validateActor, FORM_INICIAL,
} from "../utils/involucrados.js";
import { useRef, useEffect } from "react";
import { drawInterestPowerChart, drawStakeholderNetwork } from "../utils/dibujarGraficos.js";
import { actorValidationMessages } from "../utils/validacionesActores.js";
import { participationTechniques } from "../data/tecnicasParticipacion.js";

export function Involucrados() {

  const { caso, setCaso } = useCasoContext();
  const [form, setForm] = useState(FORM_INICIAL);
  const [editingIndex, setEditingIndex] = useState(null);

  const interestPowerRef = useRef(null);
  const networkRef = useRef(null);

    const validaciones = actorValidationMessages(caso.involucrados);

  useEffect(() => {
    drawInterestPowerChart(interestPowerRef.current, caso.involucrados);
    drawStakeholderNetwork(networkRef.current, caso.involucrados);
  }, [caso.involucrados]);

  function actualizarForm(campo, valor) {
    setForm(prev => ({ ...prev, [campo]: valor }));
  }

  function limpiarForm() {
    setForm(FORM_INICIAL);
    setEditingIndex(null);
  }

  function guardarActor() {
    const actor = { ...form, problemas_percibidos: normalizeLines(form.problemasTexto || "") };
    // problemas_percibidos ya viene como arreglo si el usuario escribió en el textarea; ver nota abajo
    if (!validateActor(actor)) return;

    setCaso(prev => {
      const involucrados = [...prev.involucrados];
      if (editingIndex === null) involucrados.push(actor);
      else involucrados[editingIndex] = actor;
      return { ...prev, involucrados };
    });
    limpiarForm();
  }

  function editarActor(index) {
    const actor = caso.involucrados[index];
    if (!actor) return;
    setForm({ ...actor, problemasTexto: (actor.problemas_percibidos || []).join("\n") });
    setEditingIndex(index);
  }

  function eliminarActor(index) {
    const actor = caso.involucrados[index];
    if (!actor) return;
    if (!confirm(`¿Desea eliminar este involucrado?\n\n${actor.grupo}`)) return;
    setCaso(prev => ({ ...prev, involucrados: prev.involucrados.filter((_, i) => i !== index) }));
    if (editingIndex === index) limpiarForm();
  }

    function actualizarParticipacion(key, valor) {
    setCaso(prev => ({ ...prev, participacion: { ...prev.participacion, [key]: valor } }));
  }

  async function copiarPrompt(texto, event) {
    const button = event.target;
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // Sin fallback de textarea: los navegadores modernos en servidor local (Vite) soportan clipboard API
    }
    const original = button.textContent;
    button.textContent = "Copiado";
    setTimeout(() => { button.textContent = original; }, 1500);
  }

  const tecnicaSeleccionada = participationTechniques[caso.participacion.tecnica];

  const ordenados = caso.involucrados
    .map((actor, index) => ({ actor, index, result: calculateActorResult(actor) }))
    .sort((a, b) => Math.abs(b.result) - Math.abs(a.result));

  return (
    <section className="screen active">
      <div className="hero">
        <div className="kicker">Paso 1</div>
        <h2>Análisis de involucrados</h2>
        <p>Identifica los grupos y organizaciones relacionados con el problema, analiza sus intereses, problemas percibidos, recursos y mandatos, y caracteriza su posición, fuerza e intensidad.</p>
      </div>

      {/* FORMULARIO */}
      <div className="card">
        <h3>{editingIndex === null ? "Registrar involucrado" : "Editar involucrado"}</h3>
        <div className="actor-form-grid">
          <div className="actor-field">
            <label htmlFor="actorGrupo">Cargo u organización *</label>
            <input id="actorGrupo" type="text" placeholder="Ej. Alcaldía municipal / Asociación de productores"
              value={form.grupo} onChange={e => actualizarForm("grupo", e.target.value)} />
            <small>Registre únicamente cargos, grupos u organizaciones. No registre nombres de personas naturales ni datos de contacto.</small>
          </div>

          <div className="actor-field">
            <label htmlFor="actorNaturaleza">Naturaleza *</label>
            <select id="actorNaturaleza" value={form.naturaleza} onChange={e => actualizarForm("naturaleza", e.target.value)}>
              <option value="">Seleccione</option>
              <option value="Comunitaria">Comunitaria</option>
              <option value="Institucional">Institucional</option>
              <option value="Productiva">Productiva</option>
              <option value="Educativa">Educativa</option>
              <option value="Social">Social</option>
              <option value="Privada">Privada</option>
              <option value="Financiera">Financiera</option>
              <option value="Gremial">Gremial</option>
              <option value="Otra">Otra</option>
            </select>
          </div>

          <div className="actor-field">
            <label htmlFor="actorRelacion">Relación con el problema *</label>
            <input id="actorRelacion" type="text" placeholder="Ej. Afectado directamente por el problema"
              value={form.relacion} onChange={e => actualizarForm("relacion", e.target.value)} />
          </div>

          <div className="actor-field">
            <label htmlFor="actorRol">Rol frente al problema *</label>
            <input id="actorRol" type="text" placeholder="Ej. Beneficiario, regulador, financiador"
              value={form.rol} onChange={e => actualizarForm("rol", e.target.value)} />
          </div>

          <div className="actor-field full">
            <label htmlFor="actorIntereses">Intereses en relación directa con el problema *</label>
            <textarea id="actorIntereses" placeholder="¿Qué busca, necesita o espera este grupo frente al problema?"
              value={form.intereses} onChange={e => actualizarForm("intereses", e.target.value)} />
          </div>

          <div className="actor-field full">
            <label htmlFor="actorProblemas">Problemas percibidos *</label>
            <textarea id="actorProblemas" placeholder="Escriba un problema por línea, desde la perspectiva del grupo y en negativo."
              value={form.problemasTexto || ""} onChange={e => actualizarForm("problemasTexto", e.target.value)} />
            <small>Cada línea se convertirá en un elemento independiente de la lista.</small>
          </div>

          <div className="actor-field full">
            <label htmlFor="actorRecursos">Recursos y mandatos *</label>
            <textarea id="actorRecursos" placeholder="Recursos disponibles, capacidades, competencias, normas o mandatos institucionales."
              value={form.recursos_mandatos} onChange={e => actualizarForm("recursos_mandatos", e.target.value)} />
          </div>

          <div className="actor-field">
            <label htmlFor="actorPosicion">Posición *</label>
            <select id="actorPosicion" value={form.posicion} onChange={e => actualizarForm("posicion", e.target.value)}>
              <option value="">Seleccione</option>
              <option value="1">+1 · A favor</option>
              <option value="0">0 · Neutral / indiferente</option>
              <option value="-1">−1 · En contra</option>
            </select>
          </div>

          <div className="actor-field">
            <label htmlFor="actorFuerza">Fuerza / poder (1–5) *</label>
            <select id="actorFuerza" value={form.fuerza} onChange={e => actualizarForm("fuerza", e.target.value)}>
              <option value="">Seleccione</option>
              <option value="1">1 · Muy baja</option>
              <option value="2">2 · Baja</option>
              <option value="3">3 · Media</option>
              <option value="4">4 · Alta</option>
              <option value="5">5 · Muy alta</option>
            </select>
            <small>Dimensión de poder o capacidad de influencia. No se promedia con el interés.</small>
          </div>

          <div className="actor-field">
            <label htmlFor="actorIntensidad">Intensidad / interés (1–5) *</label>
            <select id="actorIntensidad" value={form.intensidad} onChange={e => actualizarForm("intensidad", e.target.value)}>
              <option value="">Seleccione</option>
              <option value="1">1 · Muy baja</option>
              <option value="2">2 · Baja</option>
              <option value="3">3 · Media</option>
              <option value="4">4 · Alta</option>
              <option value="5">5 · Muy alta</option>
            </select>
            <small>Dimensión de interés o afectación. No se promedia con el poder.</small>
          </div>

          <div className="actor-field full">
            <label htmlFor="actorRazon">Razón de la valoración *</label>
            <textarea id="actorRazon" placeholder="Justifique la posición, la fuerza y la intensidad asignadas."
              value={form.razon} onChange={e => actualizarForm("razon", e.target.value)} />
          </div>

          <div className="actor-field full">
            <label htmlFor="actorEstrategia">Estrategia de relacionamiento *</label>
            <textarea id="actorEstrategia" placeholder="Describa cómo se gestionará la relación con este grupo."
              value={form.estrategia} onChange={e => actualizarForm("estrategia", e.target.value)} />
          </div>
        </div>

        <div className="actor-actions">
          {editingIndex !== null && (
            <button type="button" className="btn" onClick={limpiarForm}>Cancelar edición</button>
          )}
          <button type="button" className="btn btn-primary" onClick={guardarActor}>
            {editingIndex === null ? "Agregar involucrado" : "Guardar cambios"}
          </button>
        </div>
      </div>

            <div className="card method-layer">
        <div className="validation-panel">
          <div className="validation-header">
            <h3>Validaciones metodológicas</h3>
            <span className="validation-count">
              {validaciones.length === 0 ? "Sin hallazgos" : `${validaciones.length} hallazgo${validaciones.length === 1 ? "" : "s"}`}
            </span>
          </div>
          <div className="validation-list">
            {validaciones.length === 0 ? (
              <div className="validation-item validation-success">
                <span className="validation-icon">✓</span>
                <div>
                  <strong>No se identifican hallazgos automáticos.</strong><br />
                  El análisis supera las comprobaciones configuradas. Esto no sustituye la revisión metodológica ni la validación con los involucrados.
                </div>
              </div>
            ) : validaciones.map((msg, i) => (
              <div className="validation-item validation-warning" key={i}>
                <span className="validation-icon">!</span>
                <div>{msg}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="card">
        <h3>Cuadro de análisis de involucrados</h3>
        <p className="footer-note">El cuadro conserva exactamente las cuatro columnas requeridas. Los problemas percibidos se presentan como lista, uno por línea.</p>
        <div className="actor-table-wrap">
          <table className="actor-table">
            <thead>
              <tr><th>Grupos</th><th>Intereses</th><th>Problemas percibidos</th><th>Recursos y mandatos</th></tr>
            </thead>
            <tbody>
              {caso.involucrados.length === 0 ? (
                <tr><td colSpan={4} className="actor-empty">Aún no hay involucrados registrados.</td></tr>
              ) : caso.involucrados.map((actor, i) => (
                <tr key={i}>
                  <td className={!actor.grupo ? "empty-cell" : ""}>{actor.grupo || "Celda vacía"}</td>
                  <td className={!actor.intereses ? "empty-cell" : ""}>{actor.intereses || "Celda vacía"}</td>
                  <td className={!actor.problemas_percibidos?.length ? "empty-cell" : ""}>
                    {actor.problemas_percibidos?.length
                      ? <ul className="actor-problem-list">{actor.problemas_percibidos.map((p, j) => <li key={j}>{p}</li>)}</ul>
                      : "Celda vacía"}
                  </td>
                  <td className={!actor.recursos_mandatos ? "empty-cell" : ""}>{actor.recursos_mandatos || "Celda vacía"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CARACTERIZACIÓN */}
      <div className="card">
        <h3>Caracterización y priorización</h3>
        <p className="footer-note">La resultante se calcula en cada actualización como <strong>fuerza × intensidad × posición</strong>. No se almacena como dato del involucrado.</p>
        <div className="actor-table-wrap">
          <table className="characterization-table">
            <thead>
              <tr>
                <th>Grupos</th><th>Posición</th><th>Fuerza / poder</th><th>Intensidad / interés</th>
                <th>Resultante</th><th>Cuadrante</th><th>Razón de la valoración</th><th>Estrategia</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenados.length === 0 ? (
                <tr><td colSpan={9} className="actor-empty">Aún no hay involucrados registrados.</td></tr>
              ) : ordenados.map(({ actor, index, result }) => (
                <tr key={index}>
                  <td><strong>{actor.grupo}</strong></td>
                  <td><span className={actorPositionClass(actor.posicion)}>{actorPositionLabel(actor.posicion)}</span></td>
                  <td>{actor.fuerza}/5</td>
                  <td>{actor.intensidad}/5</td>
                  <td className={result > 0 ? "result-positive" : result < 0 ? "result-negative" : "position-neutral"}>
                    {result > 0 ? "+" : ""}{result}
                  </td>
                  <td><span className="quadrant-badge">{actorQuadrant(actor)}</span></td>
                  <td>{actor.razon}</td>
                  <td>{actor.estrategia}</td>
                  <td>
                    <div className="actor-table-actions">
                      <button type="button" className="btn-mini" onClick={() => editarActor(index)}>Editar</button>
                      <button type="button" className="btn-mini" onClick={() => eliminarActor(index)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="validation-note">
          <strong>Regla metodológica:</strong> poder e interés son dimensiones distintas. La fuerza representa el poder/capacidad de influencia y la intensidad representa el interés o afectación. No se promedian. La resultante únicamente se calcula cuando se necesita para ordenar la caracterización.
        </div>
      </div>

            <div className="card">
        <h3>Representaciones gráficas</h3>
        <p className="footer-note">Las representaciones se generan automáticamente a partir de los involucrados registrados y se actualizan cada vez que cambia la lista.</p>

        <div className="section-head">
          <div>
            <h3>Mapa de involucrados</h3>
            <p>Relación de los grupos involucrados con el proyecto, agrupados por naturaleza.</p>
          </div>
        </div>
        <div className="actor-chart-wrapper">
          <svg ref={interestPowerRef} className="actor-svg" viewBox="0 0 760 540" role="img" aria-label="Matriz de interés y poder de los involucrados" />
        </div>
      </div>

      <div className="card">
        <div className="section-head">
          <div>
            <h3>Diagrama de involucrados</h3>
            <p>Relación de los grupos involucrados con el proyecto, agrupados por proyecto.</p>
          </div>
          <div className="actor-chart-wrapper">
            <svg ref={networkRef} className="actor-svg" viewBox="0 0 760 540" role="img" aria-label="Diagrama de involucrados alrededor del proyecto" />
          </div>
        </div>
      </div>

            <div className="card method-layer">
        <div className="hero" style={{ marginBottom: 18 }}>
          <div className="kicker">Actividad 4 · Paso 1</div>
          <h3>Identificación, análisis y selección con los involucrados</h3>
          <p>Selecciona una técnica de participación y justifica su uso a partir de la caracterización de los involucrados.</p>
        </div>

        <div className="participation-grid">
          <div className="participation-selection">
            <label htmlFor="participationTechnique">Técnica seleccionada *</label>
            <select id="participationTechnique" value={caso.participacion.tecnica}
              onChange={e => actualizarParticipacion("tecnica", e.target.value)}>
              <option value="">Seleccione una técnica</option>
              <option value="grupos_nominales">Grupos nominales</option>
              <option value="delphi">Delphi</option>
              <option value="easw">EASW</option>
              <option value="nucleos_intervencion">Núcleos de intervención participativa</option>
            </select>

            <label htmlFor="participationActors">Involucrados convocados *</label>
            <textarea id="participationActors" placeholder="Indique los grupos u organizaciones que participarían."
              value={caso.participacion.involucrados} onChange={e => actualizarParticipacion("involucrados", e.target.value)} />

            <label htmlFor="participationMoment">Momento de aplicación *</label>
            <input id="participationMoment" type="text" placeholder="Ej. Validación del problema y priorización"
              value={caso.participacion.momento} onChange={e => actualizarParticipacion("momento", e.target.value)} />

            <label htmlFor="participationProduct">Producto esperado *</label>
            <textarea id="participationProduct" placeholder="¿Qué producto concreto se espera obtener?"
              value={caso.participacion.producto} onChange={e => actualizarParticipacion("producto", e.target.value)} />

            <label htmlFor="participationLimitations">Limitaciones previstas</label>
            <textarea id="participationLimitations" placeholder="Condiciones que podrían limitar la técnica en este caso."
              value={caso.participacion.limitaciones} onChange={e => actualizarParticipacion("limitaciones", e.target.value)} />
          </div>

          <div className="participation-help">
            {!tecnicaSeleccionada ? (
              <>
                <h4>Ayuda contextual</h4>
                <p style={{ fontSize: 12, color: "var(--gris-500)" }}>Seleccione una técnica para consultar su procedimiento, participantes, duración y cuándo evitarla.</p>
              </>
            ) : (
              <>
                <h4>{tecnicaSeleccionada.nombre}</h4>
                <div className="technique-meta">
                  <div className="technique-meta-item"><strong>Participantes</strong><span>{tecnicaSeleccionada.participantes}</span></div>
                  <div className="technique-meta-item"><strong>Duración</strong><span>{tecnicaSeleccionada.duracion}</span></div>
                </div>
                <div className="technique-section"><strong>Procedimiento</strong><p>{tecnicaSeleccionada.procedimiento}</p></div>
                <div className="technique-section"><strong>Cuándo evitarla</strong><p>{tecnicaSeleccionada.evitar}</p></div>
                <div className="participation-note">La información contextual orienta la decisión; no la toma por usted.</div>
              </>
            )}
          </div>
        </div>

        <div className="participation-justification">
          <label htmlFor="participationJustification">Justificación de la elección</label>
          <textarea id="participationJustification" placeholder="Justifique en función de la fuerza, intensidad, posición, intereses y limitaciones de los involucrados."
            value={caso.participacion.justificacion} onChange={e => actualizarParticipacion("justificacion", e.target.value)} />
        </div>

        <div className="participation-note">
          <strong>Regla metodológica:</strong> la técnica no se selecciona automáticamente. El artefacto puede mostrar información contextual, pero la decisión sobre qué técnica utilizar, con quién, cuándo y para qué producto corresponde al formulador.
        </div>
      </div>

      <div className="card method-layer">
        <div className="hero" style={{ marginBottom: 18 }}>
          <div className="kicker">Uso de inteligencia artificial</div>
          <h3>Instrucciones para IA</h3>
          <p>Utilice estas instrucciones como apoyo para revisar el análisis, no para delegar las decisiones metodológicas.</p>
        </div>

        <details className="ai-panel">
          <summary>Instrucción 1 · Revisión crítica del análisis de involucrados</summary>
          <div className="ai-content">
            <p>Utilice esta instrucción para solicitar una revisión metodológica del cuadro sin permitir que la IA invente actores o tome decisiones.</p>
            <div className="ai-prompt-box">
              <pre className="ai-prompt">{`Actúa como revisor metodológico de un análisis de involucrados basado en la Metodología de Marco Lógico CEPAL/ILPES.

Revisa exclusivamente la información que te proporcione.

Identifica:
1. posibles grupos omitidos;
2. problemas percibidos formulados en positivo;
3. problemas percibidos formulados como soluciones o como ausencia de una solución;
4. intereses que no tengan relación directa con el problema;
5. valoraciones de posición, fuerza e intensidad que carezcan de justificación;
6. posibles inconsistencias entre poder e interés;
7. grupos demasiado amplios que deban desagregarse.

NO inventes involucrados.
NO inventes intereses, problemas, recursos ni mandatos.
NO modifiques posición, fuerza o intensidad.
NO selecciones la estrategia de relacionamiento por el formulador.

Entrega únicamente hallazgos y preguntas de revisión. Marca toda propuesta como propuesta de IA, con confianza baja y sin evidencia propia.`}</pre>
              <button type="button" className="ai-copy-btn" onClick={e => copiarPrompt(e.target.previousSibling.textContent, e)}>Copiar</button>
            </div>
          </div>
        </details>

        <details className="ai-panel" style={{ marginTop: 10 }}>
          <summary>Instrucción 2 · Revisión de problemas percibidos</summary>
          <div className="ai-content">
            <p>Utilice esta instrucción para contrastar la redacción de los problemas percibidos sin convertirlos automáticamente en causas.</p>
            <div className="ai-prompt-box">
              <pre className="ai-prompt">{`Revisa los siguientes problemas percibidos por involucrados.

Para cada uno indica:
- si está formulado como estado negativo;
- si está formulado en positivo;
- si está formulado como una solución;
- si está expresado como ausencia de una solución;
- si parece demasiado general;
- si requiere mayor precisión.

No reescribas automáticamente los problemas.
No los conviertas en causas del árbol.
No inventes información.

Presenta las observaciones como recomendaciones que el formulador debe validar.`}</pre>
              <button type="button" className="ai-copy-btn" onClick={e => copiarPrompt(e.target.previousSibling.textContent, e)}>Copiar</button>
            </div>
          </div>
        </details>

        <details className="ai-panel" style={{ marginTop: 10 }}>
          <summary>Instrucción 3 · Preparación de la Actividad 4</summary>
          <div className="ai-content">
            <p>Utilice esta instrucción para recibir una comparación de las técnicas sin delegar la decisión.</p>
            <div className="ai-prompt-box">
              <pre className="ai-prompt">{`Actúa como apoyo para preparar la Actividad 4 del Paso 1 de la Metodología de Marco Lógico.

Con base únicamente en la caracterización de los involucrados que te proporcione:

1. describe qué ventajas y limitaciones tendría cada técnica disponible;
2. relaciona cada técnica con los tipos de involucrados y la situación identificada;
3. señala qué información adicional necesitaría el formulador para decidir;
4. presenta alternativas de decisión, sin escoger una por él.

Las técnicas a considerar son:
- Grupos nominales.
- Delphi.
- EASW.
- Núcleos de intervención participativa.

NO selecciones la técnica.
NO inventes participantes.
NO inventes datos del caso.
NO inventes evidencia.
Toda recomendación debe quedar marcada como propuesta de IA, con confianza baja.`}</pre>
              <button type="button" className="ai-copy-btn" onClick={e => copiarPrompt(e.target.previousSibling.textContent, e)}>Copiar</button>
            </div>
          </div>
        </details>

        <div className="ai-responsible-note">
          <strong>Uso responsable de la IA:</strong> la inteligencia artificial se utiliza como apoyo para revisar, comparar y formular propuestas. El criterio metodológico y las decisiones finales pertenecen al formulador. No introduzca en herramientas de IA nombres de personas naturales, números de identificación, teléfonos, correos electrónicos ni otros datos personales. El artefacto mantiene esta prohibición como regla permanente, en concordancia con la Ley 1581 de 2012.
        </div>
      </div>

      <div className="wizard-actions">
        <button type="button" className="btn primary" onClick={() => setPantallaActiva(2)}>
          Continuar al análisis del problema →
        </button>
      </div>
    </section>
  );
}