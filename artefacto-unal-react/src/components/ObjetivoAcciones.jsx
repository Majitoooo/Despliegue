export function ObjetivoAcciones() {
  return (
    <div className="objective-subscreen active">
      <div className="card">
        <div className="section-head">
          <div>
            <h3>4. Identificación de acciones</h3>
            <p>
              Identifica acciones asociadas a los medios operacionalizables y verifica su relación causal.
            </p>
          </div>
        </div>

        <div id="actionsWorkspace">
          <div className="notice">Los medios operacionalizables y sus acciones aparecerán aquí.</div>
        </div>
      </div>

      <div className="card">
        <div className="section-head">
          <div>
            <h3>Cadena de trazabilidad</h3>
            <p>Cada acción debe poder relacionarse con el medio, la causa y el problema central.</p>
          </div>
        </div>

        <div id="actionTraceabilityWorkspace">
          <div className="notice">La cadena acción → medio → causa → problema se verificará aquí.</div>
        </div>
      </div>
    </div>
  );
}
