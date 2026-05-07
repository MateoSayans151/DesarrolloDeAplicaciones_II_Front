import api from "./api";

export interface SubastaResponse {
  id: number;
  fecha: string;
  hora: string;
  estado: "abierta" | "cerrada";
  creadorUsuarioId: number;
  categoria: "comun" | "especial" | "plata" | "oro" | "platino";
  ubicacion?: string;
  capacidadAsistentes?: number;
}

export interface SubastaRequest {
  fecha: string;
  hora: string;
  estado?: "abierta" | "cerrada";
  creadorUsuarioId: number;
  ubicacion?: string;
  capacidadAsistentes?: number;
  tieneDeposito?: "si" | "no";
  seguridadPropia?: "si" | "no";
  categoria: "comun" | "especial" | "plata" | "oro" | "platino";
}

export interface RegistroSubastaResponse {
  identificador: number;
  subasta: number;
  propietarioUsuarioId: number;
  producto: number;
  compradorUsuarioId?: number;
  importe: number;
  comision: number;
}

const subastaService = {
  async listarAbiertas(): Promise<SubastaResponse[]> {
    const res = await api.get<SubastaResponse[]>("/subastas/abiertas");
    return res.data;
  },

  async obtener(id: number): Promise<SubastaResponse> {
    const res = await api.get<SubastaResponse>(`/subastas/${id}`);
    return res.data;
  },

  async crear(data: SubastaRequest): Promise<SubastaResponse> {
    const res = await api.post<SubastaResponse>("/subastas", data);
    return res.data;
  },

  async cambiarEstado(id: number, estado: "abierta" | "cerrada"): Promise<void> {
    await api.patch(`/subastas/${id}/estado`, { estado });
  },

  async cerrar(id: number): Promise<void> {
    await api.post(`/subastas/${id}/cerrar`);
  },

  async obtenerRegistro(id: number): Promise<RegistroSubastaResponse[]> {
    const res = await api.get<RegistroSubastaResponse[]>(`/subastas/${id}/registro`);
    return res.data;
  },
};

export default subastaService;
