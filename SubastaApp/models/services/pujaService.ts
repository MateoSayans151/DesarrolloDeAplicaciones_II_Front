import api from "./api";

export interface PujaResponse {
  identificador: number;
  asistente: number;
  item: number;
  importe: number;
  ganador: "si" | "no";
}

const pujaService = {
  async pujar(itemId: number, data: { asistente: number; importe: number }): Promise<PujaResponse> {
    const res = await api.post<PujaResponse>(`/items/${itemId}/pujas`, data);
    return res.data;
  },

  async historial(itemId: number): Promise<PujaResponse[]> {
    const res = await api.get<PujaResponse[]>(`/items/${itemId}/pujas`);
    return res.data;
  },
};

export default pujaService;
