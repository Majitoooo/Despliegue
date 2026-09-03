export function ObjetivoEvaluacion() {
  return (
    <div className="objective-subscreen active">
      <div className="card">
        <div className="section-head">
          <div>
            <h3>6. Evaluación de alternativas</h3>
            <p>
              Compara las alternativas mediante criterios y pesos editables. La escala de valoración será de
              1 a 5.
            </p>
          </div>
        </div>

        <div id="alternativeEvaluationWorkspace">
          <div className="notice">
            La matriz de evaluación aparecerá cuando existan alternativas configuradas.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-head">
          <div>
            <h3>Sensibilidad</h3>
            <p>Revisa el comportamiento de la comparación ante variaciones de ±0,10 en los pesos.</p>
          </div>
        </div>

        <div id="sensitivityWorkspace">
          <div className="notice">
            La sensibilidad se calculará a partir de los pesos definidos por el formulador.
          </div>
        </div>
      </div>
    </div>
  );
}
