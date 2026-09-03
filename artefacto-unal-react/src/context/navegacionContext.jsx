import { createContext, useContext, useState } from "react";

const NavegacionContext = createContext(null);

export function NavegacionProvider({ children }) {
  const [pantallaActiva, setPantallaActiva] = useState(0);
  return (
    <NavegacionContext.Provider value={{ pantallaActiva, setPantallaActiva }}>
      {children}
    </NavegacionContext.Provider>
  );
}

export function useNavegacion() {
  const ctx = useContext(NavegacionContext);
  if (!ctx) throw new Error("useNavegacion debe usarse dentro de <NavegacionProvider>");
  return ctx;
}