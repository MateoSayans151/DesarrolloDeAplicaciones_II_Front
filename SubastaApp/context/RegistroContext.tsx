import React, { createContext, useContext, useState, ReactNode } from "react";
import { API_BASE_URL } from "../config";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type TipoMedioPago = "CHEQUE" | "TARJETA" | "CUENTA_BANCARIA";

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
  cbu?: string;
  alias?: string;
  banco?: string;
}

export interface RegistroData {
  // Paso 1
  nombre: string;
  apellido: string;
  domicilio: string;
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
  submitRegistro: (registroData?: RegistroData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// ─── Estado inicial ───────────────────────────────────────────────────────────

const initialData: RegistroData = {
  nombre: "",
  apellido: "",
  domicilio: "",
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
  };

  const submitRegistro = async (registroData = data) => {
    setLoading(true);
    setError(null);
    try {
      const body = {
        documento: registroData.documento,
        nombre: registroData.nombre,
        apellido: registroData.apellido,
        pais: registroData.pais,
        domicilio: registroData.domicilio,
        password: registroData.password,
        fotoDocumentoFrente: registroData.fotoDocumentoFrente ?? "",
        fotoDocumentoDorso: registroData.fotoDocumentoDorso ?? "",
        fotoPerfil: registroData.fotoPerfil,
        medioPagos: registroData.medioPagos,
      };

      const response = await fetch(`${API_BASE_URL}/usuarios/registro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || `Error ${response.status}`);
      }

      resetRegistro();
    } catch (e: any) {
      setError(e.message ?? "Error desconocido");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegistroContext.Provider
      value={{ data, setPaso1, setPaso2, setMedioPago, resetRegistro, submitRegistro, loading, error }}
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
