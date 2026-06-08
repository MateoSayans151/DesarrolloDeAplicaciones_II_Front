import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export interface UsuarioRegistroRequest {
  documento: string;
  nombre: string;
  apellido: string;
  localidad: string;
  calle: string;
  numeroCalle: number;
  codigoPostal: number;
  pais: string;
  fotoDocumentoFrente: string;
  fotoDocumentoDorso: string;
  password: string;
}

export interface RegistroInicialRequest {
  documento: string;
  nombre: string;
  apellido: string;
  pais: string;
  localidad: string;
  calle: string;
  numeroCalle: number;
  codigoPostal: number;
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
  role?: "USER" | "ADMIN";
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

export interface EstadisticasUsuarioResponse {
  usuarioId: number;
  categoria: string;
  subastasCreadas: number;
  productosSubidos: number;
  productosVendidos: number;
  pujasGanadas: number;
  montoTotalGastado: number;
}

export interface NotificacionResponse {
  id: number;
  titulo: string;
  mensaje: string;
  categoriaDestino: string;
  fechaCreacion: string;
}

export interface MiPujaResponse {
  pujaId: number;
  importe: number;
  mejorImporte: number;
  esMejorPuja: boolean;
  itemId: number;
  precioBase: number;
  productoDescripcion: string;
  subastaId: number;
  subastaFecha: string;
  subastaEstado: "abierta" | "cerrada";
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
    const { fotoDocumentoFrente, fotoDocumentoDorso, ...perfilReducido } = res.data as any;
    await AsyncStorage.setItem("usuario", JSON.stringify(perfilReducido));
    return res.data;
  },

  async obtenerPorId(id: number): Promise<UsuarioResponse> {
    const res = await api.get<UsuarioResponse>(`/usuarios/${id}`);
    return res.data;
  },

  async actualizarPerfil(data: {
    nombre?: string;
    domicilio?: string;
    fotoBase64?: string;
  }): Promise<UsuarioResponse> {
    const res = await api.patch<UsuarioResponse>("/usuarios/me", data);
    return res.data;
  },

  async agregarMedioPago(req: Record<string, unknown>): Promise<PaymentMethod> {
    const res = await api.post<PaymentMethod>("/usuarios/me/medios-pago", req);
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
    const res = await api.get<TokenResponse>(`/usuarios/dev/token-registro/${documento}`);
    await AsyncStorage.setItem("token", res.data.token);
    return res.data;
  },

  async obtenerEstadisticas(id: number): Promise<EstadisticasUsuarioResponse> {
    const res = await api.get<EstadisticasUsuarioResponse>(`/usuarios/${id}/estadisticas`);
    return res.data;
  },

  async obtenerNotificaciones(): Promise<NotificacionResponse[]> {
    const res = await api.get<NotificacionResponse[]>("/notificaciones/me");
    return res.data;
  },

  async listarMisPujas(usuarioId: number): Promise<MiPujaResponse[]> {
    const res = await api.get<MiPujaResponse[]>(`/usuarios/${usuarioId}/pujas`);
    return res.data;
  },

  async listarPendientes(): Promise<UsuarioResponse[]> {
    const res = await api.get<UsuarioResponse[]>("/usuarios/admin/pendientes");
    return res.data;
  },

  async verificarUsuario(id: number, aprobar: boolean): Promise<{ token?: string }> {
    const res = await api.post<{ token?: string }>(`/usuarios/admin/${id}/verificacion`, {
      verificado: aprobar ? "si" : "no",
    });
    return res.data;
  },
};

export default usuarioService;
