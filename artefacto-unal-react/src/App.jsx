import { useNavegacion } from "./context/navegacionContext.jsx";
import { useCasoContext } from "./context/casoContext.jsx";
import { navItems } from "./data/navItems.js";
import { Navegacion } from "./components/Navegacion.jsx";
import { FichaCaso } from "./components/FichaCaso.jsx";
import { Involucrados } from "./components/Involucrados.jsx";
import { ProblemaArbol } from "./components/ProblemaArbol.jsx";
import { AnalisisObjetivos } from "./components/AnalisisObjetivos.jsx";
import { PantallaConstruccion } from "./components/PantallaConstruccion.jsx";
import { ExportarImportarJSON } from "./components/ExportarImportarJSON.jsx";

/* Pantallas 4 a 10: módulos en construcción, igual que en el artefacto original */
const PANTALLAS_EN_CONSTRUCCION = [4, 5, 6, 7, 8, 9, 10];

function App() {
  const { pantallaActiva } = useNavegacion();
  const { caso } = useCasoContext();

  const item = navItems.find(x => x.id === pantallaActiva);
  const tituloProyecto = caso.caso.titulo.trim() || "Proyecto sin título";

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">MML</div>
          <h1>Formulación de Proyectos</h1>
          <p>Artefacto educativo basado en la Metodología de Marco Lógico CEPAL/ILPES.</p>
        </div>
        <Navegacion />
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="project-title">
            <div className="eyebrow">Proyecto</div>
            <strong>{tituloProyecto}</strong>
          </div>

          <ExportarImportarJSON />

          <div className="step-badge">
            <span>{item?.step || "Punto de partida"}</span>
            <strong>{item?.label}</strong>
          </div>
        </header>

        <div className="content">
          {pantallaActiva === 0 && <FichaCaso />}
          {pantallaActiva === 1 && <Involucrados />}
          {pantallaActiva === 2 && <ProblemaArbol />}
          {pantallaActiva === 3 && <AnalisisObjetivos />}
          {PANTALLAS_EN_CONSTRUCCION.includes(pantallaActiva) && (
            <PantallaConstruccion id={pantallaActiva} />
          )}

          <p className="footer-note">
            Artefacto educativo en construcción. Estructura basada en la secuencia de diez pasos de la
            Metodología de Marco Lógico de CEPAL/ILPES y en los documentos de formulación del curso.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;