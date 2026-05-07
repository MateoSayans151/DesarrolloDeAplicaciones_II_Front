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

export interface CatalogoDetalleResponse extends CatalogoResponse {
  items: ItemCatalogoResponse[];
}

const catalogoService = {
  async obtenerPublico(subastaId: number): Promise<ItemCatalogoResponse[]> {
    const res = await api.get<ItemCatalogoResponse[]>(`/catalogos/publico/${subastaId}`);
    return res.data;
  },

  async obtenerDetalle(id: number): Promise<CatalogoDetalleResponse> {
    const res = await api.get<CatalogoDetalleResponse>(`/catalogos/${id}/detalle`);
    return res.data;
  },

  async crear(data: { descripcion: string; subasta?: number; creadorUsuarioId: number }): Promise<CatalogoResponse> {
    const res = await api.post<CatalogoResponse>("/catalogos", data);
    return res.data;
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
