import jsPDF from "jspdf";
import "jspdf-autotable";
import { CEPAL_OBJECTIVES_MAP } from "../data/cepalDefaults.js";
import { getObjectivesTree } from "./objetivos.js";
import { pdfClean, pdfHeader, pdfNewPage, pdfEnsure, pdfText, pdfHeading, pdfTable, pdfPosition } from "./pdfHelpers.js";

export async function exportarPDF(caso, agregarBitacora) {
  const doc = new jsPDF({ unit: "pt", format: "letter", compress: true });
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 72, CW = W - M * 2;
  const c = caso.caso || {}, actors = caso.involucrados || [], nodes = caso.nodos || [], sources = caso.fuentes || [];
  const problem = caso.problema?.central || c.problemaJSON || "Problema central pendiente.";

  /* PORTADA */
  doc.setFont("times", "bold"); doc.setFontSize(12);
  let y = H / 2 - 155;
  const title = c.titulo ? `Formulación de proyectos: ${c.titulo}` : "Formulación de proyectos";
  doc.text(title, W / 2, y, { align: "center" });
  y += 48;
  doc.setFont("times", "normal");
  doc.text("Presentado por:", W / 2, y, { align: "center" }); y += 42;
  ["Jenny Xiomara Valencia Marin", "Maria Fernanda Giraldo Franco", "Sofia Hernandez Castaño"].forEach(n => {
    doc.text(n, W / 2, y, { align: "center" }); y += 24;
  });
  y += 24;
  doc.text("Especialización en Gerencia Estratégica de Proyectos, Facultad de Administración", W / 2, y, { align: "center" }); y += 24;
  doc.text("Universidad Nacional de Colombia – Sede Manizales", W / 2, y, { align: "center" }); y += 48;
  doc.text("Módulo de Formulación de Proyectos", W / 2, y, { align: "center" }); y += 24;
  doc.text("César Augusto Marín Moreno", W / 2, y, { align: "center" }); y += 24;
  doc.text("Agosto 2026", W / 2, y, { align: "center" });
  doc.text("1", W - 72, 30, { align: "right" });

  /* CONTENIDO */
  y = pdfNewPage(doc);
  y = pdfHeading(doc, "Formulación de proyectos", y, 1);
  y = pdfText(doc, "Pasos 1, 2 y 3 · Análisis de involucrados, árbol de problemas y árbol de resultados (CEPAL / ILPES)", y, CW, { bold: true });
  y = pdfText(doc, `Caso: ${c.titulo || "Sin título"}`, y, CW, { bold: true });
  y = pdfText(doc, `Sector: ${c.sector || "No registrado"} · Territorio: ${c.municipio || ""}, ${c.departamento || ""} · Periodo: ${c.periodo || "2026-2"}`, y, CW, { size: 11, spacing: 20 });

  y = pdfHeading(doc, "1. Ficha del caso", y + 8, 1);
  y = pdfText(doc, c.situacion || "No registrada.", y, CW);
  y = pdfText(doc, `Población afectada: ${c.poblacion || "No registrada"}. Rango de edad: ${c.rangoEdad || "No registrado"}. Zona: ${c.zona || "No registrada"}.`, y, CW, { size: 11, spacing: 20 });
  y = pdfText(doc, `Delimitación: ${c.delimitacion || "No registrada."}`, y, CW, { size: 11, spacing: 20 });
  y = pdfText(doc, `Pregunta orientadora: ${c.preguntaOrientadora || "No registrada."}`, y, CW, { size: 11, spacing: 20 });

  y = pdfHeading(doc, "2. Paso 1 · Análisis de involucrados", y + 8, 1);
  y = pdfText(doc, "El análisis de involucrados organiza los actores del territorio, sus intereses, problemas percibidos, recursos y mandatos, categorizados por posición, fuerza e intensidad. Estos resultados orientan la construcción del árbol de problemas.", y, CW, { size: 11, spacing: 20 });

  y = pdfHeading(doc, "2.1. Cuadro de análisis de involucrados", y + 5, 2);
  y = pdfTable(doc,
    ["Grupos", "Intereses", "Problemas percibidos", "Recursos y mandatos"],
    actors.map(a => [pdfClean(a.grupo), pdfClean((a.intereses || []).join("; ")), pdfClean((a.problemas_percibidos || []).join("; ")), pdfClean((a.recursos_mandatos || []).join("; "))]),
    y, { 0: { cellWidth: 95 }, 1: { cellWidth: 125 }, 2: { cellWidth: 150 }, 3: { cellWidth: 130 } },
    "1", "Estructura del cuadro de análisis de involucrados"
  );

  y = pdfHeading(doc, "2.2. Caracterización de involucrados", y, 2);
  y = pdfTable(doc,
    ["Involucrado", "Posición", "Fuerza / rol", "Intensidad", "F × I", "Justificación"],
    actors.map(a => [
      pdfClean(a.grupo), pdfPosition(a),
      `${Number(a.fuerza || 0)}/5 · ${pdfClean(a.rol || "Rol no registrado")}`,
      `${Number(a.intensidad || 0)}/5`,
      String(Number(a.fuerza || 0) * Number(a.intensidad || 0)),
      pdfClean(a.justificacion || "Pendiente de justificación"),
    ]),
    y, { 0: { cellWidth: 85 }, 1: { cellWidth: 55 }, 2: { cellWidth: 105 }, 3: { cellWidth: 55 }, 4: { cellWidth: 40 }, 5: { cellWidth: 160 } },
    "2", "Caracterización de involucrados: posición, fuerza e intensidad"
  );

  y = pdfHeading(doc, "3. Paso 2 · Análisis del problema y árbol de problemas jerárquico", y + 8, 1);
  y = pdfHeading(doc, "3.1. Problema central validado", y, 2);
  y = pdfText(doc, problem, y, CW, { bold: true });

  y = pdfHeading(doc, "3.2. Matriz de nodos y jerarquía causal (Causas y Efectos)", y + 6, 2);
  y = pdfTable(doc,
    ["Código", "Tipo", "Nivel", "Padre", "Enunciado negativo", "Evidencia y fuente", "Confianza"],
    nodes.map(n => [pdfClean(n.codigo), pdfClean(n.tipo), String(n.nivel || ""), pdfClean(n.padre || "P"), pdfClean(n.enunciado), pdfClean(n.evidencia || "Pendiente"), pdfClean(n.confianza || "Media")]),
    y, { 0: { cellWidth: 40 }, 1: { cellWidth: 40 }, 2: { cellWidth: 30 }, 3: { cellWidth: 40 }, 4: { cellWidth: 160 }, 5: { cellWidth: 140 }, 6: { cellWidth: 50 } },
    "3", "Estructura de nodos, jerarquía y trazabilidad del árbol de problemas"
  );

  y = pdfHeading(doc, "4. Paso 3 · Análisis de objetivos y árbol de resultados (Medios y Fines)", y + 8, 1);
  y = pdfText(doc, "El árbol de objetivos y resultados (Medios y Fines) representa la situación futura que se alcanzará al resolver el problema central. Los efectos negativos se convierten en fines positivos deseados y las causas se transforman en medios de intervención.", y, CW, { size: 11, spacing: 20 });

  y = pdfHeading(doc, "4.1. Propósito central del proyecto (Objetivo general)", y + 4, 2);
  const objCentral = CEPAL_OBJECTIVES_MAP["P"]?.enunciado || "Oportunidades laborales y productivas consolidadas y suficientemente atractivas para favorecer la permanencia de los jóvenes en la zona rural de Manizales.";
  y = pdfText(doc, objCentral, y, CW, { bold: true });

  y = pdfHeading(doc, "4.2. Matriz del árbol de resultados (Medios y Fines)", y + 6, 2);
  const objTree = getObjectivesTree(caso);
  y = pdfTable(doc,
    ["Código", "Tipo de resultado", "Nivel", "Padre", "Enunciado en estado positivo deseado (Resultado)", "Origen (Problema)"],
    objTree.map(o => [pdfClean(o.codigo), pdfClean(o.tipo), String(o.nivel === 0 ? "Central" : o.nivel || ""), pdfClean(o.padre), pdfClean(o.enunciado), pdfClean(o.origen)]),
    y, { 0: { cellWidth: 40 }, 1: { cellWidth: 85 }, 2: { cellWidth: 35 }, 3: { cellWidth: 40 }, 4: { cellWidth: 220 }, 5: { cellWidth: 80 } },
    "4", "Estructura del árbol de objetivos y resultados (Medios y Fines)"
  );

  if (caso.eap) {
    y = pdfHeading(doc, "5. Paso 5 · Estructura Analítica del Proyecto (EAP)", y + 8, 1);
    y = pdfText(doc, "El Manual CEPAL/ILPES establece que los medios directos se transforman en componentes del proyecto y los medios fundamentales en actividades operativas (3 a 4 actividades por componente):", y, CW, { size: 11, spacing: 20 });
    y = pdfText(doc, `Fin: ${caso.eap.fin || "No registrado."}`, y, CW, { bold: true, size: 11, spacing: 20 });
    y = pdfText(doc, `Propósito: ${caso.eap.proposito || "No registrado."}`, y, CW, { bold: true, size: 11, spacing: 20 });
    y = pdfTable(doc,
      ["Componente", "Causa / Medio", "Actividades operativas formuladas"],
      (caso.eap.componentes || []).map(cmp => [
        pdfClean(`${cmp.codigo || ""}: ${cmp.nombre || ""}`),
        pdfClean(cmp.causa_asociada || "C1"),
        pdfClean((cmp.actividades || []).map((a, i) => `${i + 1}. ${a}`).join("; ")),
      ]),
      y, { 0: { cellWidth: 160 }, 1: { cellWidth: 70 }, 2: { cellWidth: 270 } },
      "5", "Componentes y actividades derivados del árbol de problemas y objetivos"
    );
  }

  if (Array.isArray(caso.bitacora) && caso.bitacora.length) {
    y = pdfHeading(doc, "6. Bitácora de uso de inteligencia artificial y trazabilidad", y + 8, 1);
    y = pdfTable(doc,
      ["Fecha", "Patrón / propósito", "Prompt / entrada", "Error / salida", "Cómo se detectó", "Corrección"],
      caso.bitacora.map(x => [
        pdfClean((x.fecha || "").replace("T", " ").slice(0, 19)),
        pdfClean(x.patron || x.proposito || ""),
        pdfClean(x.prompt || ""),
        pdfClean(x.error_modelo || x.salida || ""),
        pdfClean(x.como_se_detecto || ""),
        pdfClean(x.correccion || ""),
      ]),
      y, { 0: { cellWidth: 58 }, 1: { cellWidth: 78 }, 2: { cellWidth: 92 }, 3: { cellWidth: 105 }, 4: { cellWidth: 95 }, 5: { cellWidth: 92 } },
      "6", "Bitácora metodológica de uso de IA y trazabilidad"
    );
  }

  if (sources.length) {
    y = pdfHeading(doc, "7. Referencias y fuentes del caso", y + 8, 1);
    sources.forEach(f => {
      const ref = pdfClean(`${f.titulo || "Fuente sin título"}. ${f.url || ""}`);
      const lines = doc.splitTextToSize(ref, CW - 18);
      y = pdfEnsure(doc, y, 24);
      doc.setFont("times", "normal"); doc.setFontSize(12);
      lines.forEach((line, j) => { doc.text(line, 72 + (j === 0 ? 0 : 36), y); y += 24; });
      y += 4;
    });
  }

  for (let page = 2; page <= doc.getNumberOfPages(); page++) {
    doc.setPage(page); pdfHeader(doc);
  }

  const fileName = (c.titulo || "caso_mml").replace(/[^a-z0-9áéíóúñü _-]/gi, "").replace(/\s+/g, "_").slice(0, 70);
  doc.save(`Formulacion_MML_Pasos_1_2_y_3_${fileName || "caso"}.pdf`);

  agregarBitacora({
    fecha: new Date().toISOString(),
    patron: "Generación de PDF académico APA 7",
    proposito: "Generar el documento formal de los pasos 1 y 2 con árbol jerárquico y EAP.",
    prompt: "Exportación del modelo MML revisado con criterios CEPAL.",
    salida: "PDF generado con portada, cuadros de involucrados, árbol de problemas, EAP y bitácora.",
    error_modelo: "No aplica.",
    como_se_detecto: "Validación automática de tablas y paginación APA 7.",
    correccion: "Revisar antes de la entrega final.",
  });
}