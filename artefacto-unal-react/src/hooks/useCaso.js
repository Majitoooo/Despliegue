import { useLocalStorage } from "./useLocalStorage";
import { normalize } from "../utils/normalize";
import casoBase from "../data/casoBase.json";

const STORAGE_KEY = "mml_jovenes_rurales_v7_cepal";

export function useCaso() {
  const [caso, setCaso] = useLocalStorage(STORAGE_KEY, normalize(casoBase));

  function actualizarCampo(seccion, cambios) {
    setCaso(prev => ({
      ...prev,
      [seccion]: { ...prev[seccion], ...cambios }
    }));
  }

  return { caso, setCaso, actualizarCampo };
}