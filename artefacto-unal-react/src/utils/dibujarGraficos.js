import { svgEl, addSvgText, actorPointColor, natureColor, splitSvgLabel } from "./svgHelpers.js";
import { calculateActorResult } from "./involucrados.js";

export function drawInterestPowerChart(svg, involucrados) {
  if (!svg) return;
  svg.innerHTML = "";
  const width = 760, height = 540;
  const plot = { left: 72, right: 705, top: 48, bottom: 450 };
  const plotWidth = plot.right - plot.left, plotHeight = plot.bottom - plot.top;
  const xScale = value => plot.left + ((Number(value) - 1) / 4) * plotWidth;
  const yScale = value => plot.bottom - ((Number(value) - 1) / 4) * plotHeight;

  svg.appendChild(svgEl("rect", { x: plot.left, y: plot.top, width: plotWidth, height: plotHeight, fill: "#ffffff", stroke: "#d1d5db" }));

  for (let value = 1; value <= 5; value++) {
    const x = xScale(value), y = yScale(value);
    svg.appendChild(svgEl("line", { x1: x, y1: plot.top, x2: x, y2: plot.bottom, class: "svg-grid" }));
    svg.appendChild(svgEl("line", { x1: plot.left, y1: y, x2: plot.right, y2: y, class: "svg-grid" }));
    addSvgText(svg, String(value), x, plot.bottom + 22, "svg-tick");
    addSvgText(svg, String(value), plot.left - 22, y + 4, "svg-tick");
  }

  const midX = xScale(3), midY = yScale(3);
  svg.appendChild(svgEl("line", { x1: midX, y1: plot.top, x2: midX, y2: plot.bottom, class: "svg-quadrant-line" }));
  svg.appendChild(svgEl("line", { x1: plot.left, y1: midY, x2: plot.right, y2: midY, class: "svg-quadrant-line" }));

  svg.appendChild(svgEl("line", { x1: plot.left, y1: plot.bottom, x2: plot.right + 12, y2: plot.bottom, class: "svg-axis" }));
  svg.appendChild(svgEl("line", { x1: plot.left, y1: plot.bottom, x2: plot.left, y2: plot.top - 12, class: "svg-axis" }));

  svg.appendChild(svgEl("polygon", { points: `${plot.right + 12},${plot.bottom} ${plot.right + 3},${plot.bottom - 5} ${plot.right + 3},${plot.bottom + 5}`, fill: "#374151" }));
  svg.appendChild(svgEl("polygon", { points: `${plot.left},${plot.top - 12} ${plot.left - 5},${plot.top - 3} ${plot.left + 5},${plot.top - 3}`, fill: "#374151" }));

  addSvgText(svg, "INTERÉS / AFECTACIÓN", (plot.left + plot.right) / 2, 500, "svg-axis-label");
  const yLabel = addSvgText(svg, "PODER / INFLUENCIA", 20, (plot.top + plot.bottom) / 2, "svg-axis-label");
  yLabel.setAttribute("transform", `rotate(-90 20 ${(plot.top + plot.bottom) / 2})`);

  addSvgText(svg, "ALTO PODER · BAJO INTERÉS", xScale(2), 20, "svg-quadrant-title");
  addSvgText(svg, "Mantener satisfecho", xScale(2), 35, "svg-quadrant-strategy");
  addSvgText(svg, "ALTO PODER · ALTO INTERÉS", xScale(4), 20, "svg-quadrant-title");
  addSvgText(svg, "Involucrar estrechamente", xScale(4), 35, "svg-quadrant-strategy");
  addSvgText(svg, "BAJO PODER · BAJO INTERÉS", xScale(2), 425, "svg-quadrant-title");
  addSvgText(svg, "Monitorear", xScale(2), 440, "svg-quadrant-strategy");
  addSvgText(svg, "BAJO PODER · ALTO INTERÉS", xScale(4), 425, "svg-quadrant-title");
  addSvgText(svg, "Involucrar y empoderar", xScale(4), 440, "svg-quadrant-strategy");

  if (!involucrados.length) {
    addSvgText(svg, "Registre involucrados para visualizar la matriz", width / 2, 260, "svg-empty-text");
    return;
  }

  const occupied = {};
  involucrados.forEach(actor => {
    const x = xScale(actor.intensidad), y = yScale(actor.fuerza);
    const key = `${actor.intensidad}-${actor.fuerza}`;
    if (!occupied[key]) occupied[key] = 0;
    const duplicateIndex = occupied[key]++;
    const result = calculateActorResult(actor);
    const radius = 8 + Math.min(20, Math.sqrt(Math.abs(result)) * 1.8);

    svg.appendChild(svgEl("circle", { cx: x, cy: y, r: radius, fill: actorPointColor(actor.posicion), "fill-opacity": "0.82", stroke: "#ffffff", "stroke-width": "2" }));

    const labelAbove = duplicateIndex % 2 === 0;
    const verticalOffset = labelAbove
      ? -(radius + 14 + Math.floor(duplicateIndex / 2) * 18)
      : (radius + 16 + Math.floor(duplicateIndex / 2) * 18);
    const lines = splitSvgLabel(actor.grupo, 18);
    lines.forEach((line, lineIndex) => {
      addSvgText(svg, line, x, y + verticalOffset + lineIndex * 12, "svg-stakeholder-label");
    });
  });

  const legendY = 525;
  [{ position: "1", label: "Apoya (+1)" }, { position: "0", label: "Indiferente (0)" }, { position: "-1", label: "Se opone (−1)" }]
    .forEach((item, index) => {
      const x = 95 + index * 170;
      svg.appendChild(svgEl("circle", { cx: x, cy: legendY - 4, r: 7, fill: actorPointColor(item.position) }));
      addSvgText(svg, item.label, x + 12, legendY, "svg-legend-text");
    });
}

export function drawStakeholderNetwork(svg, involucrados) {
  if (!svg) return;
  svg.innerHTML = "";
  const center = { x: 290, y: 275 }, radius = 175;

  svg.appendChild(svgEl("circle", { cx: center.x, cy: center.y, r: radius, fill: "none", stroke: "#d1d5db", "stroke-width": "1", "stroke-dasharray": "4 5" }));
  svg.appendChild(svgEl("circle", { cx: center.x, cy: center.y, r: 58, class: "svg-project-node" }));
  addSvgText(svg, "PROYECTO", center.x, center.y, "svg-project-label");

  if (!involucrados.length) {
    addSvgText(svg, "Registre involucrados para visualizar el diagrama", center.x, center.y + 100, "svg-empty-text");
    return;
  }

  const total = involucrados.length;
  involucrados.forEach((actor, index) => {
    const angle = (-Math.PI / 2) + (index / total) * Math.PI * 2;
    const x = center.x + Math.cos(angle) * radius;
    const y = center.y + Math.sin(angle) * radius;
    const result = calculateActorResult(actor);
    const nodeRadius = 28 + Math.min(12, Math.sqrt(Math.abs(result)) * 1.1);

    svg.appendChild(svgEl("line", { x1: center.x, y1: center.y, x2: x, y2: y, class: "svg-network-line" }));
    svg.appendChild(svgEl("circle", { cx: x, cy: y, r: nodeRadius, fill: natureColor(actor.naturaleza), "fill-opacity": "0.78", stroke: natureColor(actor.naturaleza), "stroke-width": "1.5" }));

    const lines = splitSvgLabel(actor.grupo, 16);
    const firstY = y - ((lines.length - 1) * 6);
    lines.forEach((line, lineIndex) => addSvgText(svg, line, x, firstY + lineIndex * 12, "svg-stakeholder-label"));
  });

  const legendX = 535, legendY = 100;
  addSvgText(svg, "LEYENDA · NATURALEZA", legendX, legendY - 24, "svg-axis-label");
  const natureList = ["Comunitaria", "Institucional", "Productiva", "Educativa", "Social", "Privada", "Financiera", "Gremial", "Otra"];
  natureList.forEach((nature, index) => {
    const y = legendY + index * 34;
    svg.appendChild(svgEl("circle", { cx: legendX, cy: y, r: 8, fill: natureColor(nature) }));
    addSvgText(svg, nature, legendX + 17, y + 4, "svg-legend-text");
  });
}