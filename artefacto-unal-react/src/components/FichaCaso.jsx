import { useCasoContext } from "../context/casoContext.jsx";
import { useNavegacion } from "../context/navegacionContext.jsx";

export function FichaCaso() {
  const { caso, setCaso } = useCasoContext();
  const { setPantallaActiva } = useNavegacion();

  function actualizarCampo(key, valor) {
    setCaso(prev => ({ ...prev, caso: { ...prev.caso, [key]: valor } }));
  }

  function iniciarWizard() {
    setPantallaActiva(1);
  }

  return (
    <section className="screen active">
      <div className="hero">
        <div className="kicker">Punto de partida</div>
        <h2>Ficha del caso</h2>
        <p>Delimita el caso propio antes de iniciar el análisis metodológico. Esta información constituye el punto de partida del proyecto.</p>
      </div>

      <div className="card">
        <div className="case-grid">
          <div className="form-group full">
            <label htmlFor="casoTitulo">Título del proyecto</label>
            <input id="casoTitulo" type="text" placeholder="Escriba un título claro y descriptivo"
              value={caso.caso.titulo} onChange={e => actualizarCampo("titulo", e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="casoSector">Sector o ámbito de intervención</label>
            <input id="casoSector" type="text" placeholder="Ej. desarrollo rural"
              value={caso.caso.sector} onChange={e => actualizarCampo("sector", e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="casoTerritorio">Territorio</label>
            <input id="casoTerritorio" type="text" placeholder="Municipio, departamento y zona"
              value={caso.caso.territorio} onChange={e => actualizarCampo("territorio", e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="casoPoblacion">Población principal</label>
            <input id="casoPoblacion" type="text" placeholder="Grupo poblacional"
              value={caso.caso.poblacion} onChange={e => actualizarCampo("poblacion", e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="casoPeriodo">Periodo de referencia</label>
            <input id="casoPeriodo" type="text" placeholder="Periodo del proyecto o del análisis"
              value={caso.caso.periodo} onChange={e => actualizarCampo("periodo", e.target.value)} />
          </div>
          <div className="form-group full">
            <label htmlFor="casoSituacion">Situación actual</label>
            <textarea id="casoSituacion" placeholder="Describa brevemente la situación que da origen al proyecto."
              value={caso.caso.situacion} onChange={e => actualizarCampo("situacion", e.target.value)} />
          </div>
          <div className="form-group full">
            <label htmlFor="casoPregunta">Pregunta orientadora</label>
            <input id="casoPregunta" type="text" placeholder="¿Qué situación se busca transformar y para quién?"
              value={caso.caso.pregunta} onChange={e => actualizarCampo("pregunta", e.target.value)} />
          </div>
          <div className="form-group full">
            <label htmlFor="casoDelimitacion">Delimitación del caso</label>
            <textarea id="casoDelimitacion" placeholder="Precise población, territorio, periodo y alcance del análisis."
              value={caso.caso.delimitacion} onChange={e => actualizarCampo("delimitacion", e.target.value)} />
          </div>
        </div>
        <div className="case-note">
          <strong>Uso metodológico:</strong> la ficha delimita el caso; no reemplaza el análisis de involucrados ni la construcción del problema. La formulación debe partir de un caso propio, verificable y pertinente.
        </div>
      </div>

      <div className="wizard-actions">
        <button type="button" className="btn primary" onClick={iniciarWizard}>
          Iniciar construcción del Marco Lógico →
        </button>
      </div>
    </section>
  );
}