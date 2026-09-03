import { navItems } from "../data/navItems.js";
import { useNavegacion } from "../context/navegacionContext.jsx";

export function Navegacion() {
  const { pantallaActiva, setPantallaActiva } = useNavegacion();
  const grupos = ["Punto de partida", "Análisis situacional", "Matriz de Marco Lógico"];

  return (
    <nav id="navigation">
      {grupos.map(grupo => (
        <div className="nav-section" key={grupo}>
          <div className="nav-section-title">{grupo}</div>
          {navItems.filter(item => item.group === grupo).map(item => (
            <button
              key={item.id}
              type="button"
              className="nav-item"
              onClick={() => setPantallaActiva(item.id)}
              style={{ fontWeight: pantallaActiva === item.id ? "bold" : "normal" }}
            >
              <span className="nav-num">{item.id}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}