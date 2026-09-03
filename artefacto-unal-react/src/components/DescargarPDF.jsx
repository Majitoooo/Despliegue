import { useState } from "react";
import { useCasoContext } from "../context/casoContext.jsx";
import { exportarPDF } from "../utils/exportarPDF.js";

export function DescargarPDF() {
  const { caso, setCaso } = useCasoContext();
  const [generando, setGenerando] = useState(false);

  function agregarBitacora(entrada) {
    setCaso(prev => ({ ...prev, bitacora: [entrada, ...(prev.bitacora || [])] }));
  }

  async function manejarClick() {
    setGenerando(true);
    try {
      await exportarPDF(caso, agregarBitacora);
    } catch (err) {
      console.error(err);
      alert("No se pudo generar el PDF. Verifica la conexión y vuelve a intentarlo.");
    } finally {
      setGenerando(false);
    }
  }

  return (
    <button onClick={manejarClick} disabled={generando}>
      {generando ? "Generando PDF…" : "Descargar PDF · Pasos 1, 2 y 3"}
    </button>
  );
}