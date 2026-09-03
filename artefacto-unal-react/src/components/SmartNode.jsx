export function SmartNode({ node, levelClass, levelTag }) {
  if (!node) return null;
  return (
    <div className={`smart-node ${levelClass}`}>
      <div className="smart-node-head">
        <span className="smart-node-code">{node.codigo}</span>
        <span className="smart-node-level-tag">{levelTag}</span>
      </div>
      <p className="smart-node-text">{node.enunciado}</p>
      <div className="smart-node-footer">
        <span>Padre: <strong>{node.padre || "P"}</strong></span>
        <span
          className="smart-node-badge"
          style={{
            background: node.confianza === "Alta" ? "#dcfce7" : "#f1f5f9",
            color: node.confianza === "Alta" ? "#15803d" : "#475569",
          }}
        >
          {node.confianza || "Media"}
        </span>
      </div>
    </div>
  );
}