import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export interface UsuarioRegistroRequest {
  documento: string;
  nombre: string;
  direccion?: string;
  password: string;
}

export interface RegistroInicialRequest {
  documento: string;
  nombre: string;
  apellido: string;
  pais: string;
  domicilio: string;
  fotoDocumentoFrente: string;
  fotoDocumentoDorso: string;
}

export interface RegistroFinalRequest {
  password: string;
  medioPagos: any[];
}


export interface LoginRequest {
  documento: string;
  password: string;
}

export interface UsuarioResponse {
  id: number;
  documento: string;
  nombre: string;
  direccion?: string;
  fotoBase64?: string;
  verificado: "si" | "no";
  categoria?: "comun" | "especial" | "plata" | "oro" | "platino";
  mediosPago?: PaymentMethod[];
}

export interface PaymentMethod {
  id: number;
  tipo: string;
  ultimosNumeros: number;
  verificado: "si" | "no";
}

export interface TokenResponse {
  token: string;
  tipo: string;
}

const usuarioService = {
  async registrar(data: UsuarioRegistroRequest): Promise<UsuarioResponse> {
    const res = await api.post<UsuarioResponse>("/usuarios/registro", data);
    return res.data;
  },

  async login(data: LoginRequest): Promise<TokenResponse> {
    const res = await api.post<TokenResponse>("/usuarios/login", data);
    await AsyncStorage.setItem("token", res.data.token);
    return res.data;
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("usuario");
  },

  async obtenerPerfil(): Promise<UsuarioResponse> {
    const res = await api.get<UsuarioResponse>("/usuarios/me");
    await AsyncStorage.setItem("usuario", JSON.stringify(res.data));
    return res.data;
  },

  async obtenerPorId(id: number): Promise<UsuarioResponse> {
    const res = await api.get<UsuarioResponse>(`/usuarios/${id}`);
    return res.data;
  },

  async actualizarPerfil(data: {
    nombre?: string;
    direccion?: string;
    fotoBase64?: string;
  }): Promise<UsuarioResponse> {
    const res = await api.put<UsuarioResponse>("/usuarios/me", data);
    return res.data;
  },

  async getUsuarioLocal(): Promise<UsuarioResponse | null> {
    const raw = await AsyncStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  },

  async isLoggedIn(): Promise<boolean> {
    const token = await AsyncStorage.getItem("token");
    return !!token;
  },

  async registroInicial(data: RegistroInicialRequest): Promise<UsuarioResponse> {
    const res = await api.post<UsuarioResponse>("/usuarios/registro-inicial", data);
    return res.data;
  },

  async registroFinal(data: RegistroFinalRequest): Promise<UsuarioResponse> {
    const res = await api.post<UsuarioResponse>("/usuarios/registro-final", data);
    return res.data;
  },

  async obtenerTokenRegistroDev(documento: string): Promise<TokenResponse> {
    const res = await api.get<TokenResponse>(`/usuarios/token-registro-dev/${documento}`);
    await AsyncStorage.setItem("token", res.data.token);
    return res.data;
  },
};

export default usuarioService;
