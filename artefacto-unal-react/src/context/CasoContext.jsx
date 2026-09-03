import { createContext, useContext, useState } from "react";

const ESTADO_INICIAL = {
  caso: {
    titulo: "", sector: "", territorio: "", poblacion: "",
    periodo: "", situacion: "", pregunta: "", delimitacion: "",
  },
  involucrados: [],
  editingActorIndex: null,
  problema: { condicion: "", atributo: "", poblacion: "", delimitacion: "", enunciado: "" },
  nodos: [],
  objetivos: [],
  acciones: [],
  alternativas: [],
  evaluacion: { criterios: [], pesos: {}, valoraciones: {}, sensibilidad: {} },
  seleccion: { alternativa: "", justificacion: "" },
  bitacora: [],
    participacion: {
    tecnica: "", involucrados: "", momento: "", producto: "", limitaciones: "", justificacion: "",
  },
};

const CasoContext = createContext(null);

export function CasoProvider({ children }) {
  const [caso, setCaso] = useState(ESTADO_INICIAL);

  /*
   * Equivalente a los `state.bitacora.push({...})` del script original.
   * Centraliza la garantía de que la bitácora siempre sea un arreglo.
   */
  function registrarBitacora(entrada) {
    setCaso(prev => ({
      ...prev,
      bitacora: [...(Array.isArray(prev.bitacora) ? prev.bitacora : []), { fecha: new Date().toISOString(), ...entrada }],
    }));
  }

  return (
    <CasoContext.Provider value={{ caso, setCaso, registrarBitacora }}>
      {children}
    </CasoContext.Provider>
  );
}

export function useCasoContext() {
  const ctx = useContext(CasoContext);
  if (!ctx) throw new Error("useCasoContext debe usarse dentro de <CasoProvider>");
  return ctx;
}