import { useCasoContext } from "../context/casoContext.jsx";

export function ObjetivoSeleccion() {
  const { caso, setCaso } = useCasoContext();

  const justificacion = caso.seleccion?.justificacion || "";

  function actualizarJustificacion(valor) {
    setCaso(prev => ({ ...prev, seleccion: { ...prev.seleccion, justificacion: valor } }));
  }

  return (
    <div className="objective-subscreen active">
      <div className="card">
        <div className="section-head">
          <div>
            <h3>7. Selección de la estrategia óptima</h3>
            <p>
              Documenta la alternativa seleccionada por el formulador y las razones que sustentan la
              decisión.
            </p>
          </div>
        </div>

        <div className="notice">
          <strong>Decisión humana:</strong> el sistema calcula y presenta resultados comparativos, pero no
          selecciona automáticamente la estrategia.
        </div>

        <div id="strategySelectionWorkspace" style={{ marginTop: 16 }}>
          <div className="notice">
            Las alternativas disponibles aparecerán aquí para documentar la decisión.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-head">
          <div>
            <h3>Justificación de la selección</h3>
            <p>Registra los argumentos utilizados para seleccionar la estrategia.</p>
          </div>
        </div>

        <div className="field">
          <label htmlFor="strategySelectionJustification">Justificación</label>
          <textarea id="strategySelectionJustification"
            placeholder="Explica por qué se selecciona la alternativa."
            value={justificacion}
            onChange={e => actualizarJustificacion(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
