import { useState, useEffect } from "react";

export function useLocalStorage(key, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(key);
      return guardado ? JSON.parse(guardado) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(valor));
    } catch {
      // almacenamiento no disponible, igual que el catch de saveLocal() original
    }
  }, [key, valor]);

  return [valor, setValor];
}