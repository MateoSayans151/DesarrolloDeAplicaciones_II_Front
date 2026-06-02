import React, { createContext, useContext, useState, ReactNode } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type TipoMedioPago = "CHEQUE" | "TARJETA" | "CUENTA";

export interface MedioPago {
  tipo: TipoMedioPago;
  monto?: number;
  // Cheque
  bancoEmisor?: string;
  titularCheque?: string;
  numeroCheque?: string;
  fechaEmision?: string;
  fotoTitularCheque?: string; // base64
  // Tarjeta
  numeroTarjeta?: string;
  nombre?: string;
  titular?: string;
  nombreTitular?: string;
  vencimiento?: string;
  fechaVencimiento?: string;
  cvv?: string;
  // Cuenta bancaria
  cbuAlias?: string;
  titularCuenta?: string;
  tipoCuenta?: string;
  moneda?: string;
}

export interface RegistroData {
  // Paso 1
  nombre: string;
  apellido: string;
  localidad: string;
  calle: string;
  numeroCalle: number;
  codigoPostal: number;
  pais: string;
  documento: string;
  fotoDocumentoFrente: string | null; // base64
  fotoDocumentoDorso: string | null;  // base64
  fotoPerfil: string;
  // Paso 2
  password: string;
  medioPagos: MedioPago[];
}

interface RegistroContextType {
  data: RegistroData;
  setPaso1: (campos: Partial<RegistroData>) => void;
  setPaso2: (password: string, medioPagos: MedioPago[]) => void;
  setMedioPago: (medioPago: MedioPago) => void;
  resetRegistro: () => void;
}

// ─── Estado inicial ───────────────────────────────────────────────────────────

const initialData: RegistroData = {
  nombre: "",
  apellido: "",
  localidad: "",
  calle: "",
  numeroCalle: 0,
  codigoPostal: 0,
  pais: "",
  documento: "",
  fotoDocumentoFrente: null,
  fotoDocumentoDorso: null,
  fotoPerfil: "1",
  password: "",
  medioPagos: [],
};

// ─── Context ──────────────────────────────────────────────────────────────────

const RegistroContext = createContext<RegistroContextType | undefined>(undefined);

export function RegistroProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RegistroData>(initialData);

  const setPaso1 = (campos: Partial<RegistroData>) => {
    setData((prev) => ({ ...prev, ...campos }));
  };

  const setPaso2 = (password: string, medioPagos: MedioPago[]) => {
    setData((prev) => ({ ...prev, password, medioPagos }));
  };

  const setMedioPago = (medioPago: MedioPago) => {
    setData((prev) => ({ ...prev, medioPagos: [medioPago] }));
  };

  const resetRegistro = () => {
    setData(initialData);
  };

  return (
    <RegistroContext.Provider
      value={{ data, setPaso1, setPaso2, setMedioPago, resetRegistro }}
    >
      {children}
    </RegistroContext.Provider>
  );
}

export function useRegistro() {
  const ctx = useContext(RegistroContext);
  if (!ctx) throw new Error("useRegistro debe usarse dentro de <RegistroProvider>");
  return ctx;
}
