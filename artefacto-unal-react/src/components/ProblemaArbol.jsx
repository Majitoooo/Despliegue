import { useState } from "react";
import { useCasoContext } from "../context/casoContext.jsx";
import { useNavegacion } from "../context/navegacionContext.jsx";
import { syncObjectivesFromProblemNodes } from "../utils/transformacionObjetivos.js";
import { ProblemaContexto } from "./ProblemaContexto.jsx";
import { ProblemaCentral } from "./ProblemaCentral.jsx";
import { EfectosCausas } from "./EfectosCausas.jsx";
import { ArbolProblema } from "./ArbolProblema.jsx";
import { ProblemaValidacion } from "./ProblemaValidacion.jsx";
import { PromptsIA } from "./PromptsIA.jsx";
import { Bitacora } from "./Bitacora.jsx";


const TABS = [
  { id: "contexto", label: "1. Contexto" },
  { id: "problema", label: "2. Problema central" },
  { id: "causas", label: "3. Efectos y causas" },
  { id: "arbol", label: "4. Árbol" },
  { id: "validacion", label: "5. Validación" },
  { id: "prompts", label: "6. Prompts" },
  { id: "bitacora", label: "7. Bitácora" },
];

export function ProblemaArbol() {
  const [subpantalla, setSubpantalla] = useState("contexto");
  const { setCaso } = useCasoContext();
  const { setPantallaActiva } = useNavegacion();

  /*
   * Sincroniza los nodos del árbol de problemas
   * con la estructura de objetivos.
   *
   * Todavía NO genera ni decide los objetivos.
   */
  function continuarAlPaso3() {
    setCaso(prev => ({
      ...prev,
      objetivos: syncObjectivesFromProblemNodes(prev.nodos, prev.objetivos),
    }));

    /* Llevar al usuario al Paso 3. */
    setPantallaActiva(3);
  }

  return (
    <section className="screen active">
      <div className="hero">
        <div className="kicker">Paso 2 · Análisis del problema</div>
        <h2>Análisis del problema</h2>
        <p>Construye, organiza y valida el problema central, sus efectos y sus causas antes de avanzar al análisis de objetivos.</p>
      </div>

      <div className="card">
        <div className="section-head">
          <div>
            <h3>Ruta de trabajo</h3>
            <p>El análisis del problema se desarrolla en siete momentos. Solo uno se muestra a la vez.</p>
          </div>
        </div>
        <div className="step2-nav">
          {TABS.map(tab => (
            <button key={tab.id} type="button"
              className={`step2-tab ${subpantalla === tab.id ? "active" : ""}`}
              onClick={() => setSubpantalla(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {subpantalla === "contexto" && <ProblemaContexto />}
      {subpantalla === "problema" && <ProblemaCentral irASubpantalla={setSubpantalla} />}
      {subpantalla === "causas" && <EfectosCausas />}
      {subpantalla === "arbol" && <ArbolProblema />}
      {subpantalla === "validacion" && <ProblemaValidacion />}
      {subpantalla === "prompts" && <PromptsIA />}
      {subpantalla === "bitacora" && <Bitacora />}

      {/* TRANSICIÓN · MÓDULO 2 → MÓDULO 3 */}
      <div className="wizard-actions module-transition">
        <div className="module-transition-text">
          <strong>Análisis del problema completado</strong>
          <span>El árbol de problemas alimentará directamente el análisis de objetivos.</span>
        </div>

        <button type="button" className="btn primary" onClick={continuarAlPaso3}>
          Continuar al análisis de objetivos →
        </button>
      </div>
    </section>
  );
}
