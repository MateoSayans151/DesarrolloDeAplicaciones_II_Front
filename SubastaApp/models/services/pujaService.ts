import { Client } from "@stomp/stompjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import api from "./api";

export interface PujaResponse {
  identificador: number;
  asistente: number;
  item: number;
  importe: number;
  ganador: "si" | "no";
}

const host = Constants.expoConfig?.hostUri?.split(":").shift() ?? "localhost";
const WS_URL = `ws://${host}:8080/api/v1/ws-subastas`;

const pujaService = {
  async pujar(itemId: number, data: { asistente: number; importe: number }): Promise<PujaResponse> {
    const res = await api.post<PujaResponse>(`/items/${itemId}/pujas`, data);
    return res.data;
  },

  async historial(itemId: number): Promise<PujaResponse[]> {
    const res = await api.get<PujaResponse[]>(`/items/${itemId}/pujas`);
    return res.data;
  },

  // Suscribirse a pujas en tiempo real de un item.
  // Retorna una función de cleanup que desconecta el WebSocket.
  suscribir(itemId: number, onPuja: (puja: PujaResponse) => void): () => void {
    let client: Client | null = null;

    AsyncStorage.getItem("token").then((token) => {
      client = new Client({
        brokerURL: WS_URL,
        connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
        reconnectDelay: 5000,
        onConnect: () => {
          client?.subscribe(`/topic/items/${itemId}`, (message) => {
            try {
              const puja: PujaResponse = JSON.parse(message.body);
              onPuja(puja);
            } catch {
              // mensaje malformado, ignorar
            }
          });
        },
      });
      client.activate();
    });

    return () => {
      client?.deactivate();
    };
  },
};

export default pujaService;
