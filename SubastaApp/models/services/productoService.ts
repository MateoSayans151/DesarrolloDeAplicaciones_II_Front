import api from "./api";

export interface ProductoRequest {
  fecha?: string;
  descripcionCompleta: string;
  artista?: string;
  disenador?: string;
  historia?: string;
  polizaSeguro?: string;
  aseguradora?: string;
  montoAsegurado?: number;
  monedaAsegurado?: string;
  ubicacionDeposito?: string;
  origenLicitoDeclarado: boolean;
  propietarioDeclarado: boolean;
  fotos: { fotoBase64: string }[]; // mínimo 6, validado en el backend
}

export interface ProductoResponse {
  id: number;
  descripcionCompleta: string;
  estado: "PENDIENTE" | "ACEPTADO" | "RECHAZADO" | "DEVUELTO" | "EN_SUBASTA" | "VENDIDO";
  propietarioUsuarioId: number;
  artista?: string;
  disenador?: string;
  historia?: string;
  polizaSeguro?: string;
  aseguradora?: string;
  montoAsegurado?: number;
  monedaAsegurado?: string;
  ubicacionDeposito?: string;
  motivoRechazo?: string;
  fotos?: string[];
}

const productoService = {
  async listarMisProductos(usuarioId: number): Promise<ProductoResponse[]> {
    const res = await api.get<ProductoResponse[]>(`/usuarios/${usuarioId}/productos`);
    return res.data;
  },

  async crear(data: ProductoRequest): Promise<ProductoResponse> {
    const res = await api.post<ProductoResponse>("/productos", data);
    return res.data;
  },

  async agregarFoto(productoId: number, fotoBase64: string): Promise<void> {
    await api.post(`/productos/${productoId}/fotos`, { fotoBase64 });
  },

  async obtener(id: number): Promise<ProductoResponse> {
    const res = await api.get<ProductoResponse>(`/productos/${id}`);
    return res.data;
  },

  async eliminar(id: number): Promise<void> {
    await api.delete(`/productos/${id}`);
  },

  async listarTodos(): Promise<ProductoResponse[]> {
    const res = await api.get<ProductoResponse[]>("/productos");
    return res.data;
  },

  async aprobar(id: number, precioBase: number): Promise<void> {
    await api.patch(`/productos/admin/${id}/aprobar`, { precioBase });
  },
};

export default productoService;
