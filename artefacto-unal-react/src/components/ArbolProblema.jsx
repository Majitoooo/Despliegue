import { useCasoContext } from "../context/casoContext.jsx";
import { buildProblemTreeHTML } from "../utils/renderizarArbol.js";
import { EvidenciaNodos } from "./EvidenciaNodos.jsx";

export function ArbolProblema() {
  const { caso } = useCasoContext();

  return (
    <div className="problem-subscreen active">
      <div className="card">
        <div className="section-head">
          <div>
            <h3>4. Árbol de problemas</h3>
            <p>Integra los efectos, el problema central y las causas en una estructura causal única.</p>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: buildProblemTreeHTML(caso.nodos) }} />
      </div>

      <div className="card">
        <div className="section-head">
          <div>
            <h3>Ficha de sustentación de nodos</h3>
            <p>Cada nodo debe conservar evidencia, línea base y nivel de confianza.</p>
          </div>
        </div>

        <EvidenciaNodos />
      </div>
    </div>
  );
}
