import { useState } from "react";
import { ObjetivoTransformacion } from "./ObjetivoTransformacion.jsx";
import { ObjetivoArbol } from "./ObjetivoArbol.jsx";
import { ObjetivoValidacion } from "./ObjetivoValidacion.jsx";
import { ObjetivoAcciones } from "./ObjetivoAcciones.jsx";
import { ObjetivoAlternativas } from "./ObjetivoAlternativas.jsx";
import { ObjetivoEvaluacion } from "./ObjetivoEvaluacion.jsx";
import { ObjetivoSeleccion } from "./ObjetivoSeleccion.jsx";

const TABS = [
  { id: "transformacion", label: "1. Transformación" },
  { id: "arbol", label: "2. Árbol de objetivos" },
  { id: "validacion", label: "3. Validación" },
  { id: "acciones", label: "4. Acciones" },
  { id: "alternativas", label: "5. Alternativas" },
  { id: "evaluacion", label: "6. Evaluación" },
  { id: "seleccion", label: "7. Selección" },
];

export function AnalisisObjetivos() {
  const [subpantalla, setSubpantalla] = useState("transformacion");

  return (
    <section className="screen active">
      <div className="hero">
        <div className="kicker">Paso 3 · Análisis de objetivos</div>

        <div className="hero-row">
          <div>
            <h2>Análisis de objetivos</h2>
            <p>
              Convierte el árbol de problemas en un árbol de objetivos, identifica medios y fines, formula
              acciones y compara alternativas de solución.
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="section-head">
          <div>
            <h3>Ruta de trabajo</h3>
            <p>
              El análisis de objetivos se desarrolla progresivamente. Las propuestas generadas por el sistema
              siempre requieren revisión del formulador.
            </p>
          </div>
        </div>

        <div className="step3-nav">
          {TABS.map(tab => (
            <button key={tab.id} type="button"
              className={`step3-tab ${subpantalla === tab.id ? "active" : ""}`}
              onClick={() => setSubpantalla(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {subpantalla === "transformacion" && <ObjetivoTransformacion />}
      {subpantalla === "arbol" && <ObjetivoArbol />}
      {subpantalla === "validacion" && <ObjetivoValidacion />}
      {subpantalla === "acciones" && <ObjetivoAcciones />}
      {subpantalla === "alternativas" && <ObjetivoAlternativas />}
      {subpantalla === "evaluacion" && <ObjetivoEvaluacion />}
      {subpantalla === "seleccion" && <ObjetivoSeleccion />}

      <div className="notice" style={{ marginTop: 18 }}>
        <strong>Nota metodológica:</strong> las transformaciones, acciones y resultados generados
        automáticamente se consideran propuestas y deben ser revisados por el formulador. El sistema no
        decide medios, supuestos, pesos ni estrategia.
      </div>
    </section>
  );
}
