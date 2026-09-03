export function pdfClean(v) { return String(v ?? "").replace(/\s+/g, " ").trim(); }

export function pdfHeader(doc) {
  doc.setFont("times", "normal"); doc.setFontSize(10);
  doc.text(String(doc.getNumberOfPages()), doc.internal.pageSize.getWidth() - 72, 30, { align: "right" });
}

export function pdfNewPage(doc) {
  doc.addPage();
  pdfHeader(doc);
  return 65;
}

export function pdfEnsure(doc, y, h = 24) {
  const bottom = doc.internal.pageSize.getHeight() - 55;
  if (y + h > bottom) return pdfNewPage(doc);
  return y;
}

export function pdfText(doc, text, y, width, { size = 12, bold = false, italic = false, spacing = 24 } = {}) {
  doc.setFont("times", bold ? "bold" : italic ? "italic" : "normal");
  doc.setFontSize(size);
  const lines = doc.splitTextToSize(pdfClean(text), width);
  let yy = y;
  lines.forEach(line => {
    yy = pdfEnsure(doc, yy, spacing);
    doc.text(line, 72, yy);
    yy += spacing;
  });
  return yy;
}

export function pdfHeading(doc, text, y, level = 1) {
  y = pdfEnsure(doc, y, 36);
  doc.setFont("times", level === 3 ? "bolditalic" : "bold");
  doc.setFontSize(level === 1 ? 12 : 11);
  doc.text(pdfClean(text), 72, y);
  return y + 24;
}

export function pdfTable(doc, head, body, y, colWidths, tableNo = "", tableTitle = "") {
  y = pdfEnsure(doc, y, 90);
  if (tableNo) {
    doc.setFont("times", "bold"); doc.setFontSize(11);
    doc.text(`Tabla ${tableNo}`, 72, y); y += 18;
    if (tableTitle) {
      doc.setFont("times", "italic"); doc.setFontSize(11);
      const titleLines = doc.splitTextToSize(pdfClean(tableTitle), doc.internal.pageSize.getWidth() - 144);
      titleLines.forEach(line => { y = pdfEnsure(doc, y, 18); doc.text(line, 72, y); y += 18; });
      y += 6;
    }
  }
  doc.autoTable({
    startY: y,
    margin: { left: 72, right: 72, top: 52, bottom: 52 },
    head: [head], body: body,
    theme: "plain",
    styles: { font: "times", fontSize: 9, cellPadding: 5, textColor: [30, 30, 30], valign: "top", lineColor: [80, 80, 80], lineWidth: .15, overflow: "linebreak" },
    headStyles: { font: "times", fontStyle: "bold", fontSize: 9, fillColor: [255, 255, 255], textColor: [20, 20, 20], lineColor: [20, 20, 20], lineWidth: .5 },
    alternateRowStyles: { fillColor: [249, 249, 249] },
    columnStyles: colWidths || {},
    didDrawPage: () => pdfHeader(doc),
  });
  return doc.lastAutoTable.finalY + 24;
}

export function pdfBulletList(doc, items, y, width) {
  (items || []).filter(Boolean).forEach(item => {
    const lines = doc.splitTextToSize(pdfClean(item), width - 18);
    y = pdfEnsure(doc, y, 24);
    doc.setFont("times", "normal"); doc.setFontSize(12);
    lines.forEach((line, j) => {
      if (j > 0) y = pdfEnsure(doc, y, 24);
      doc.text(j === 0 ? "• " + line : "  " + line, 72, y); y += 24;
    });
  });
  return y;
}

export function pdfPosition(a) {
  return a.posicion === "1" ? "A favor" : a.posicion === "-1" ? "En contra" : "Neutral";
}