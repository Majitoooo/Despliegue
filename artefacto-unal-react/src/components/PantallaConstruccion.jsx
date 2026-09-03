import { PANTALLAS_CONSTRUCCION } from "../data/pantallasConstruccion.js";

export function PantallaConstruccion({ id }) {
  const data = PANTALLAS_CONSTRUCCION[id];
  if (!data) return null;

  return (
    <section className="screen active">
      <div className="hero">
        <div className="kicker">{data.paso}</div>
        <h2>{data.titulo}</h2>
        <p>{data.descripcion}</p>
      </div>
      <div className="card construction">
        <div className="status">Módulo en construcción</div>
        <h3>Campos previstos</h3>
        <div className="field-list">
          {data.campos.map(([nombre, desc]) => (
            <div className="field" key={nombre}>
              <strong>{nombre}</strong>
              <span>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}