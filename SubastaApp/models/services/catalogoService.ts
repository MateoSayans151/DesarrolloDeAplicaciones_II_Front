import api from "./api";

export interface ItemCatalogoResponse {
  id: number;
  catalogo: number;
  producto: number;
  precioBase: number;
  comision: number;
}

export interface CatalogoResponse {
  id: number;
  descripcion: string;
  subasta?: number;
}

export interface ItemCatalogoDetalleResponse {
  id: number;
  catalogo: number;
  precioBase: number;
  comision: number;
  producto: {
    id: number;
    descripcionCompleta: string;
    estado: string;
    artista?: string;
  };
}

export interface CatalogoDetalleResponse extends CatalogoResponse {
  items: ItemCatalogoDetalleResponse[];
}

const catalogoService = {
  async listarTodos(): Promise<CatalogoResponse[]> {
    const res = await api.get<CatalogoResponse[]>("/catalogos");
    return res.data;
  },

  async obtenerPublico(subastaId: number): Promise<ItemCatalogoResponse[]> {
    const res = await api.get<ItemCatalogoResponse[]>(`/catalogos/publico/${subastaId}`);
    return res.data;
  },

  // El backend recibe el ID de la SUBASTA, no del catálogo
  async obtenerDetallePorSubasta(subastaId: number): Promise<CatalogoDetalleResponse> {
    const res = await api.get<CatalogoDetalleResponse>(`/catalogos/${subastaId}/detalle`);
    return res.data;
  },

  async crear(data: { descripcion: string; subasta?: number; creadorUsuarioId: number }): Promise<CatalogoResponse> {
    const res = await api.post<CatalogoResponse>("/catalogos", data);
    return res.data;
  },

  async crearAdmin(data: { descripcion: string; subasta?: number }): Promise<CatalogoResponse> {
    const res = await api.post<CatalogoResponse>("/catalogos/admin", data);
    return res.data;
  },

  async agregarItemAdmin(catalogoId: number, data: { producto: number; precioBase: number; comision: number }): Promise<ItemCatalogoResponse> {
    const res = await api.post<ItemCatalogoResponse>(`/catalogos/admin/${catalogoId}/items`, data);
    return res.data;
  },

  async removerItem(catalogoId: number, itemId: number): Promise<void> {
    await api.delete(`/catalogos/admin/${catalogoId}/items/${itemId}`);
  },

  async agregarItem(catalogoId: number, data: {
    producto: number;
    precioBase: number;
    comision: number;
  }): Promise<ItemCatalogoResponse> {
    const res = await api.post<ItemCatalogoResponse>(`/catalogos/${catalogoId}/items`, data);
    return res.data;
  },
};

export default catalogoService;
