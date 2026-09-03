import { CEPAL_PROBLEM_TREE, CEPAL_EAP } from "../data/cepalDefaults";
import { cloneData } from "./cloneData";

export function normalize(raw) {
  const info = raw.caso || raw;
  const terr = raw.territorio || {}, pob = raw.poblacion || {}, prob = raw.problema || {};
  const artefacto = raw.artefacto || {};
  return {
    sourceJSON: raw,
    caso: {
      id: info.id || "", titulo: info.titulo || info.nombre || "", nombre: info.nombre || "",
      sector: info.sector || "", lugar: terr.municipio || "", municipio: terr.municipio || "",
      departamento: terr.departamento || "", pais: terr.pais || "", zona: terr.zona || "",
      corregimientos: terr.corregimientos || "", poblacion: pob.principal || "",
      rangoEdad: pob.rango_edad || "", poblacionesRelacionadas: pob.poblaciones_relacionadas || [],
      periodo: raw.periodo || "2026-2", situacion: prob.situacion_actual || "",
      preguntaOrientadora: prob.pregunta_orientadora || "", delimitacion: prob.delimitacion || "",
      problemaJSON: prob.central || "", evidencia: (raw.fuentes || []).map(x => x.titulo || "").filter(Boolean).join("; ")
    },
    involucrados: (raw.involucrados || []).map((a, i) => ({
      id: a.id || "json-" + i, grupo: a.grupo || "", naturaleza: a.naturaleza || "", relacion: a.relacion || "",
      rol: a.rol || "", intereses: a.intereses || [], problemas_percibidos: a.problemas_percibidos || [],
      recursos_mandatos: a.recursos_mandatos || [], posicion: a.posicion || "0",
      fuerza: Number(a.fuerza || 0), intensidad: Number(a.intensidad || 0),
      justificacion: a.justificacion || a.razon || a.justificación || "",
      estrategia: a.estrategia || "", origen: a.origen || "Importado desde JSON", confianza: a.confianza || "Preliminar"
    })),
    problema: { central: prob.central || "", cond: "", atributo: "", poblacion: pob.principal || "", delim: prob.delimitacion || "" },
    factores: raw.factores_identificados || [], fuentes: raw.fuentes || [],
    participacion: raw.participacion || {}, estado: raw.estado || {},
    nodos: Array.isArray(artefacto.nodos) && artefacto.nodos.length ? artefacto.nodos : Array.isArray(raw.nodos) && raw.nodos.length ? raw.nodos : cloneData(CEPAL_PROBLEM_TREE),
    eap: artefacto.eap || raw.eap || cloneData(CEPAL_EAP),
    candidatos: [], bitacora: Array.isArray(artefacto.bitacora) ? artefacto.bitacora : Array.isArray(raw.bitacora) ? raw.bitacora : []
  };
}