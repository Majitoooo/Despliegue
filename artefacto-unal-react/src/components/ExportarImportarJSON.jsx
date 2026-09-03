import { useRef } from "react";
import { useCasoContext } from "../context/casoContext.jsx";
import { useNavegacion } from "../context/navegacionContext.jsx";
import { exportStateJSON, parseImportedState } from "../utils/estadoJSON.js";

export function ExportarImportarJSON() {
  const { caso, setCaso } = useCasoContext();
  const { setPantallaActiva } = useNavegacion();
  const inputRef = useRef(null);

  function handleExport() {
    exportStateJSON(caso);
  }

  /* Traducción de importStateJSON(): abre el selector de archivo */
  function handleImportClick() {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  }

  /*
   * Traducción del listener "change" de inputImportJSON.
   * En React no repoblamos inputs por id: al reemplazar `caso`
   * el árbol de componentes se re-renderiza solo con el nuevo estado.
   */
  function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = e => {
      try {
        const importedState = parseImportedState(e.target.result);

        setCaso(importedState);
        setPantallaActiva(importedState.current);

        alert("Estado del proyecto importado correctamente.");
      } catch (error) {
        console.error("Error al importar JSON:", error);
        alert("No fue posible importar el archivo JSON.\n\n" + error.message);
      }
    };

    reader.onerror = () => {
      console.error("No fue posible leer el archivo JSON.");
      alert("No fue posible leer el archivo seleccionado.");
    };

    reader.readAsText(file, "UTF-8");
  }

  return (
    <div className="global-actions">
      <button type="button" className="btn global-json-btn" id="btnExportJSON" onClick={handleExport}>
        Exportar JSON
      </button>

      <button type="button" className="btn global-json-btn" id="btnImportJSON" onClick={handleImportClick}>
        Importar JSON
      </button>

      <input
        type="file"
        id="inputImportJSON"
        accept=".json,application/json"
        hidden
        ref={inputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}
