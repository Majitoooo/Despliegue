import { useRef, useState } from "react";
import { useCasoContext } from "../context/casoContext.jsx";
import {
  generateProblemPrompt,
  copyProblemPrompt,
  TAREAS_PROMPT,
} from "../utils/promptsProblema.js";

const CONSULTAS = [
  {
    tipo: "problema",
    elementId: "problemPromptProblema",
    titulo: "Depuración del problema central",
    nota: "Generar una instrucción contextualizada a partir del estado actual.",
  },
  {
    tipo: "arbol",
    elementId: "problemPromptArbol",
    titulo: "Propuesta de causas y efectos",
    nota: "Generar una instrucción para ampliar hipótesis causales y efectos.",
  },
  {
    tipo: "validacion",
    elementId: "problemPromptValidacion",
    titulo: "Contradicción del árbol",
    nota: "Generar una instrucción para buscar inconsistencias y supuestos débiles.",
  },
];

export function PromptsIA() {
  const { caso, registrarBitacora } = useCasoContext();
  const [prompts, setPrompts] = useState({ problema: "", arbol: "", validacion: "" });
  const textareas = useRef({});

  /*
   * Traducción de writeProblemPrompt():
   * escribe el prompt y lo registra en la bitácora.
   * Todavía NO registramos una "salida del modelo" porque
   * el artefacto offline no está ejecutando IA.
   */
  function writeProblemPrompt(tipo, prompt, taskName) {
    setPrompts(prev => ({ ...prev, [tipo]: prompt }));

    registrarBitacora({
      patron: "Paso 2.6 · " + taskName,
      prompt,
      salida: "Prompt preparado. Pendiente de ejecutar y contrastar con el modelo.",
      error: "Pendiente de ejecutar la consulta y verificar la salida.",
      comoSeDetecto: "",
      correccion: "Pendiente de registrar la revisión humana.",
    });
  }

  function prepararConsulta(tipo) {
    const prompt = generateProblemPrompt(tipo, caso);
    if (!prompt) return;

    writeProblemPrompt(tipo, prompt, TAREAS_PROMPT[tipo]);
  }

  return (
    <div className="problem-subscreen active">
      <div className="card">
        <div className="section-head">
          <div>
            <h3>6. Asistente IA</h3>
            <p>
              La IA funciona como apoyo para depurar, proponer y cuestionar. No decide el problema ni valida
              causalidad.
            </p>
          </div>
        </div>

        <div className="notice">
          <strong>Uso responsable:</strong> las propuestas generadas por IA deben ser revisadas por el
          formulador, contrastadas con evidencia y, cuando corresponda, validadas con los involucrados.
        </div>

        <div id="problemAIPrompts" style={{ marginTop: 16 }}>
          {CONSULTAS.map(consulta => (
            <div className="card" key={consulta.tipo}>
              <h3>{consulta.titulo}</h3>
              <p className="small-note">{consulta.nota}</p>

              <button className="btn" type="button" onClick={() => prepararConsulta(consulta.tipo)}>
                Preparar consulta
              </button>

              <button className="btn" type="button"
                onClick={() => copyProblemPrompt(textareas.current[consulta.tipo])}>
                Copiar consulta
              </button>

              <textarea
                id={consulta.elementId}
                ref={el => { textareas.current[consulta.tipo] = el; }}
                style={{ marginTop: 10 }}
                readOnly
                placeholder="La instrucción aparecerá aquí."
                value={prompts[consulta.tipo]}
              />
            </div>
          ))}
        </div>

        <div className="notice" style={{ marginTop: 16 }}>
          No incorporar datos personales. La IA debe utilizarse como apoyo metodológico y no como autoridad
          sobre la realidad territorial.
        </div>
      </div>
    </div>
  );
}
