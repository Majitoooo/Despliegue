// src/utils/objetivos.js
import { CEPAL_OBJECTIVES_MAP } from "../data/cepalDefaults";

export function getObjectivesTree(caso) {
  const nodes = caso.nodos || [];
  const list = [];

  const e2Nodes = nodes.filter(n => n.tipo === "efecto" && Number(n.nivel) === 2);
  const e1Nodes = nodes.filter(n => n.tipo === "efecto" && Number(n.nivel) === 1);

  e2Nodes.forEach(e => {
    list.push(CEPAL_OBJECTIVES_MAP[e.codigo] || {
      codigo: e.codigo.replace("E", "F"), tipo: "Fin indirecto", nivel: 2,
      padre: e.padre.replace("E", "F"), enunciado: "Situación deseada: " + e.enunciado, origen: e.codigo + " (Efecto indirecto)"
    });
  });

  e1Nodes.forEach(e => {
    list.push(CEPAL_OBJECTIVES_MAP[e.codigo] || {
      codigo: e.codigo.replace("E", "F"), tipo: "Fin directo", nivel: 1,
      padre: "Obj_P", enunciado: "Situación deseada: " + e.enunciado, origen: e.codigo + " (Efecto directo)"
    });
  });

  list.push(CEPAL_OBJECTIVES_MAP["P"] || {
    codigo: "Obj_P", tipo: "Propósito Central", nivel: 0, padre: "Fin",
    enunciado: "Situación deseada del problema central", origen: "P (Problema central)"
  });

  const causes = nodes.filter(n => n.tipo === "causa")
    .sort((a, b) => Number(a.nivel) - Number(b.nivel) || String(a.codigo).localeCompare(String(b.codigo), "es", { numeric: true }));

  causes.forEach(c => {
    list.push(CEPAL_OBJECTIVES_MAP[c.codigo] || {
      codigo: c.codigo.replace("C", "M"),
      tipo: c.nivel === 1 ? "Medio directo (Componente)" : c.nivel === 2 ? "Medio indirecto" : "Medio fundamental",
      nivel: Number(c.nivel), padre: c.padre === "P" ? "Obj_P" : c.padre.replace("C", "M"),
      enunciado: "Medio: " + c.enunciado, origen: c.codigo + " (Causa)"
    });
  });

  return list;
}