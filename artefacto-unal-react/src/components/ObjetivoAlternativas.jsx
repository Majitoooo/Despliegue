export function ObjetivoAlternativas() {
  return (
    <div className="objective-subscreen active">
      <div className="card">
        <div className="section-head">
          <div>
            <h3>5. Configuración de alternativas</h3>
            <p>
              Clasifica las acciones y construye las alternativas de solución a partir de sus relaciones.
            </p>
          </div>
        </div>

        <div id="actionClassificationWorkspace">
          <div className="notice">
            Aquí se clasificará cada acción como complementaria o excluyente.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-head">
          <div>
            <h3>Alternativas configuradas</h3>
            <p>
              El núcleo común estará conformado por acciones complementarias. Cada decisión excluyente abrirá
              una rama alternativa.
            </p>
          </div>
        </div>

        <div id="alternativesWorkspace">
          <div className="notice">Aún no se han configurado alternativas.</div>
        </div>
      </div>
    </div>
  );
}
