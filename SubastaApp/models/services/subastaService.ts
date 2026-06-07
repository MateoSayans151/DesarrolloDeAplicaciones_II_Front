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

export interface AsistenteResponse {
  identificador: number;
  numeroPostor: number;
  usuarioId: number;
  subasta: number;
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
    const res = await api.post<SubastaResponse>("/subastas/admin", data);
    return res.data;
  },

  async listarTodas(): Promise<SubastaResponse[]> {
    const res = await api.get<SubastaResponse[]>("/subastas");
    return res.data;
  },

  async cambiarEstado(id: number, estado: "abierta" | "cerrada"): Promise<void> {
    await api.patch(`/subastas/admin/${id}/estado`, { estado });
  },

  async cerrar(id: number): Promise<void> {
    await api.post(`/subastas/${id}/cerrar`);
  },

  async obtenerRegistro(id: number): Promise<RegistroSubastaResponse[]> {
    const res = await api.get<RegistroSubastaResponse[]>(`/subastas/${id}/registro`);
    return res.data;
  },

  async listarAsistencias(usuarioId: number): Promise<SubastaResponse[]> {
    const res = await api.get<SubastaResponse[]>(`/usuarios/${usuarioId}/asistencias`);
    return res.data;
  },

  async listarMisSubastas(usuarioId: number): Promise<SubastaResponse[]> {
    const res = await api.get<SubastaResponse[]>(`/usuarios/${usuarioId}/subastas`);
    return res.data;
  },

  async listarAsistentes(subastaId: number): Promise<AsistenteResponse[]> {
    const res = await api.get<AsistenteResponse[]>(`/subastas/${subastaId}/asistentes`);
    return res.data;
  },

  async eliminar(id: number): Promise<void> {
    await api.delete(`/subastas/admin/${id}`);
  },

  async registrarAsistente(subastaId: number, data: { numeroPostor: number; usuarioId: number }): Promise<AsistenteResponse> {
    const res = await api.post<AsistenteResponse>(`/subastas/${subastaId}/asistentes`, data);
    return res.data;
  },
};

export default subastaService;
