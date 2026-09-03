export function svgEl(tag, attributes = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attributes).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

export function addSvgText(svg, text, x, y, className = "") {
  const node = svgEl("text", { x, y, class: className });
  node.textContent = text;
  svg.appendChild(node);
  return node;
}

export function actorPointColor(position) {
  if (position === "1") return "#16a34a";
  if (position === "-1") return "#dc2626";
  return "#c58a16";
}

export function natureColor(nature) {
  const colors = {
    "Comunitaria": "#22c55e", "Institucional": "#16a34a", "Productiva": "#84cc16",
    "Educativa": "#3b82f6", "Social": "#8b5cf6", "Privada": "#f59e0b",
    "Financiera": "#ef4444", "Gremial": "#14b8a6", "Otra": "#9ca3af",
  };
  return colors[nature] || colors["Otra"];
}

export function splitSvgLabel(text, maxChars) {
  const words = String(text || "").split(/\s+/);
  const lines = [];
  let current = "";
  words.forEach(word => {
    if (current && (current + " " + word).length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, 3);
}