import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cambiá la IP por la de tu máquina si corrés en dispositivo físico
// Para emulador Android usá: http://10.0.2.2:8080/api/v1
// Para dispositivo físico usá: http://<TU_IP_LOCAL>:8080/api/v1
// Para iOS Simulator / web usá: http://localhost:8080/api/v1
export const BASE_URL = "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Interceptor: adjunta el token JWT automáticamente en cada request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const mensaje =
      error.response?.data?.mensaje || "Error de conexión con el servidor";
    return Promise.reject(new Error(mensaje));
  }
);

export default api;
