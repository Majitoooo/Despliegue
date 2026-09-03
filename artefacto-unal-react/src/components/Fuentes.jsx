import { useCasoContext } from "../context/casoContext.jsx";

export function Fuentes() {
  const { caso } = useCasoContext();

  return (
    <div>
      <h2>Fuentes</h2>
      <div className="sources-grid">
        {(caso.fuentes || []).map((f, i) => (
          <div className="card span-6" key={i}>
            <span className="pill">{f.tipo}</span>
            <h3>{f.titulo}</h3>
            <p>{f.aporte}</p>
            <a href={f.url} target="_blank" rel="noopener" className="btn">Abrir fuente ↗</a>
          </div>
        ))}
      </div>
    </div>
  );
}