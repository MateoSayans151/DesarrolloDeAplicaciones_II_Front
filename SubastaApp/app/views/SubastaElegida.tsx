import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import subastaService, { AsistenteResponse, SubastaResponse } from "@/models/services/subastaService";
import catalogoService, { ItemCatalogoDetalleResponse } from "@/models/services/catalogoService";
import pujaService, { PujaResponse } from "@/models/services/pujaService";
import usuarioService, { UsuarioResponse } from "@/models/services/usuarioService";

// ─── Constantes ───────────────────────────────────────────────────────────────

const GOLD  = "#d4af37";
const BG    = "#050f1e";
const CARD  = "#0a1929";
const GREEN = "#4cdf8a";
const RED   = "#e74c3c";
const TIMER_INICIAL = 60;

function calcCountdown(sub: { tiempoItemSegundos?: number | null; itemActivoDesde?: number | null }): number {
  const total = sub.tiempoItemSegundos ?? TIMER_INICIAL;
  if (!sub.itemActivoDesde) return total;
  const elapsed = Math.floor((Date.now() - sub.itemActivoDesde) / 1000);
  return Math.max(1, total - elapsed);
}

const CATEGORIA_IMAGE: Record<SubastaResponse["categoria"], string> = {
  comun:    "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&h=400&fit=crop",
  especial: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&h=400&fit=crop",
  plata:    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=400&fit=crop",
  oro:      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&h=400&fit=crop",
  platino:  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=400&fit=crop",
};
type Categoria = SubastaResponse["categoria"]; // "comun" | "especial" | "plata" | "oro" | "platino"

// Devuelve el motivo por el que el usuario NO puede pujar, o null si puede.
function motivoNoPuede(usuario: UsuarioResponse | null, subasta: SubastaResponse): string | null {
  const RANK: Record<Categoria, number> = { comun: 1, especial: 2, plata: 3, oro: 4, platino: 5 };
  const tieneMedio = usuario?.mediosPago?.some((m) => m.verificado === "si");
  if (!tieneMedio) return "Necesitás un medio de pago verificado por la empresa para poder pujar.";
  const userRank = RANK[(usuario?.nivelCategoria?.nombre?.toLowerCase() as Categoria) ?? "comun"];
  const subRank = RANK[subasta.categoria];
  if (subRank > userRank) return `Tu categoría no alcanza: esta subasta es de categoría "${subasta.categoria}".`;
  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function formatTimer(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function calcRango(precioBase: number, mejorPuja: number | null, categoria: string) {
  const base = mejorPuja ?? precioBase;
  if (["comun", "especial", "plata"].includes(categoria)) {
    return { min: base + precioBase * 0.01, max: base + precioBase * 0.20 };
  }
  return { min: base + 1, max: null }; // oro/platino: solo superar
}

// ─── Pantalla de carga / error ────────────────────────────────────────────────

function CenterView({ children }: { children: React.ReactNode }) {
  return <View style={s.center}>{children}</View>;
}

// ─── Resultados (subasta cerrada) ─────────────────────────────────────────────

function ResultadosSection({
  subastaId,
  onVolver,
}: {
  subastaId: number;
  onVolver: () => void;
}) {
  const [registros, setRegistros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    subastaService
      .obtenerRegistro(subastaId)
      .then(setRegistros)
      .finally(() => setLoading(false));
  }, [subastaId]);

  return (
    <View style={[s.card, { gap: 12 }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <MaterialIcons name="emoji-events" size={20} color={GOLD} />
        <Text style={s.cardTitle}>RESULTADOS FINALES</Text>
      </View>
      {loading ? (
        <ActivityIndicator color={GOLD} />
      ) : registros.length === 0 ? (
        <Text style={s.muted}>Sin registros de venta.</Text>
      ) : (
        registros.map((r, i) => (
          <View key={i} style={[s.resultRow, { flexDirection: "column", gap: 2, paddingVertical: 10 }]}>
            <Text style={s.resultDesc} numberOfLines={2}>
              {r.productoDescripcion ?? `Producto #${r.producto}`}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={{ color: "#8aa3be", fontFamily: "serif", fontSize: 12 }}>
                🏆 {r.compradorNombre ?? "La empresa"}
              </Text>
              <Text style={[s.resultImporte, { color: GREEN }]}>${fmt(r.importe)}</Text>
            </View>
          </View>
        ))
      )}
      <TouchableOpacity style={s.joinBtn} onPress={onVolver}>
        <Text style={s.joinBtnText}>VOLVER</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Chat de historial de pujas ───────────────────────────────────────────────

function ChatPujas({
  pujas,
  asistentesMap,
}: {
  pujas: PujaResponse[];
  asistentesMap: Record<number, number>;
}) {
  if (pujas.length === 0) {
    return (
      <View style={s.chatEmpty}>
        <Text style={s.muted}>Todavía no hay pujas. ¡Sé el primero!</Text>
      </View>
    );
  }

  const mejorImporte = Math.max(...pujas.map((p) => p.importe));

  return (
    <View style={s.chatContainer}>
      {pujas.map((p, i) => {
        const esMejor = p.importe === mejorImporte && i === 0;
        const postor = asistentesMap[p.asistente] ?? p.asistente;
        return (
          <View
            key={p.identificador ?? i}
            style={[s.chatRow, esMejor && s.chatRowMejor]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[s.chatPostor, esMejor && { color: GREEN }]}>
                Postor #{postor}
              </Text>
            </View>
            <Text style={[s.chatImporte, esMejor && { color: GREEN, fontSize: 18 }]}>
              ${fmt(p.importe)}
            </Text>
            {esMejor && (
              <MaterialIcons name="star" size={16} color={GREEN} style={{ marginLeft: 6 }} />
            )}
          </View>
        );
      })}
    </View>
  );
}

// ─── Card del item activo ─────────────────────────────────────────────────────

function ItemActivoCard({
  item,
  pujas,
  asistenteId,
  categoria,
  countdown,
  onPujaLocal,
  motivoBloqueo,
}: {
  item: ItemCatalogoDetalleResponse;
  pujas: PujaResponse[];
  asistenteId: number;
  categoria: string;
  countdown: number;
  onPujaLocal: (puja: PujaResponse) => void;
  motivoBloqueo: string | null;
}) {
  const [importe, setImporte] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mejorPuja = pujas.length > 0 ? Math.max(...pujas.map((p) => p.importe)) : null;
  const rango = calcRango(item.precioBase, mejorPuja, categoria);
  const rangoTexto = rango.max != null
    ? `Oferta válida: $${fmt(rango.min)} – $${fmt(rango.max)}`
    : `Mínimo: $${fmt(rango.min)}`;

  const handlePujar = async () => {
    // Bloqueo: sin medio de pago verificado o categoría insuficiente
    if (motivoBloqueo) {
      Alert.alert("No podés pujar", motivoBloqueo);
      return;
    }
    const monto = parseFloat(importe.replace(",", "."));
    if (isNaN(monto) || monto <= 0) { setError("Ingresá un monto válido."); return; }
    setError(null);
    setLoading(true);
    try {
      const nueva = await pujaService.pujar(item.id, { asistente: asistenteId, importe: monto });
      onPujaLocal(nueva);
      setImporte("");
    } catch (e: any) {
      setError(e.message ?? "No se pudo realizar la puja.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.itemActivoCard}>
      {/* Cabecera: live badge + countdown */}
      <View style={s.itemActivoHeader}>
        <View style={s.liveBadge}>
          <View style={s.liveDot} />
          <Text style={s.liveBadgeText}>EN SUBASTA AHORA</Text>
        </View>
        <View style={s.countdownBadge}>
          <MaterialIcons name="timer" size={13} color={countdown <= 10 ? RED : GOLD} />
          <Text style={[s.countdownText, countdown <= 10 && { color: RED }]}>
            {formatTimer(countdown)}
          </Text>
        </View>
      </View>

      {/* Datos del producto */}
      <Text style={s.itemActivoTitulo} numberOfLines={2}>
        {item.producto.descripcionCompleta}
      </Text>
      {item.producto.artista ? (
        <Text style={s.itemActivoArtista}>{item.producto.artista}</Text>
      ) : null}

      {/* Precios */}
      <View style={s.preciosRow}>
        <View>
          <Text style={s.precioLabel}>PRECIO BASE</Text>
          <Text style={s.precioValor}>${fmt(item.precioBase)}</Text>
        </View>
        {mejorPuja !== null && (
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.precioLabel}>MEJOR PUJA</Text>
            <Text style={[s.precioValor, { color: GREEN, fontSize: 20 }]}>
              ${fmt(mejorPuja)}
            </Text>
          </View>
        )}
      </View>

      {/* Rango válido */}
      <Text style={s.rangoText}>{rangoTexto}</Text>

      {/* Aviso de bloqueo (sin medio de pago verificado o categoría insuficiente) */}
      {motivoBloqueo ? (
        <View style={s.bloqueoRow}>
          <MaterialIcons name="lock" size={14} color={GOLD} />
          <Text style={s.bloqueoText}>{motivoBloqueo}</Text>
        </View>
      ) : null}

      {/* Input + botón */}
      <View style={s.pujaRow}>
        <TextInput
          style={s.pujaInput}
          placeholder="Tu oferta..."
          placeholderTextColor="#3a5070"
          keyboardType="numeric"
          value={importe}
          onChangeText={setImporte}
          editable={!motivoBloqueo}
        />
        <TouchableOpacity
          style={[s.pujaBtn, (loading || !!motivoBloqueo) && { opacity: 0.5 }]}
          onPress={handlePujar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={BG} size="small" />
          ) : (
            <>
              <MaterialIcons name="gavel" size={14} color={BG} />
              <Text style={s.pujaBtnText}>PUJAR</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={s.errorRow}>
          <MaterialIcons name="error-outline" size={13} color={RED} />
          <Text style={s.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── Screen principal ─────────────────────────────────────────────────────────

export default function SubastaElegidaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [subasta, setSubasta]       = useState<SubastaResponse | null>(null);
  const [usuario, setUsuario]       = useState<UsuarioResponse | null>(null);
  const [asistente, setAsistente]   = useState<AsistenteResponse | null>(null);
  const [asistentesMap, setAsistentesMap] = useState<Record<number, number>>({});
  const [items, setItems]           = useState<ItemCatalogoDetalleResponse[]>([]);
  const [pujasActivas, setPujasActivas] = useState<PujaResponse[]>([]);
  const [loading, setLoading]       = useState(true);
  const [joining, setJoining]       = useState(false);
  const [joinError, setJoinError]   = useState<string | null>(null);
  const [countdown, setCountdown]   = useState(TIMER_INICIAL);

  const wsCancelRef = useRef<(() => void) | null>(null);
  const pollingRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const itemActivoIdRef = useRef<number | null | undefined>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const itemActivo = subasta?.itemActivoId
    ? items.find((i) => i.id === subasta.itemActivoId) ?? null
    : null;

  const itemsPendientes = items.filter(
    (i) => i.id !== subasta?.itemActivoId && (i as any).subastado !== "si"
  );
  const itemsVendidos = items.filter((i) => (i as any).subastado === "si");

  // ── Suscribir WebSocket al item activo ─────────────────────────────────────

  const suscribirItem = useCallback((itemId: number) => {
    wsCancelRef.current?.();
    wsCancelRef.current = pujaService.suscribir(itemId, (nuevaPuja) => {
      setPujasActivas((prev) => {
        // evitar duplicados
        if (prev.some((p) => p.identificador === nuevaPuja.identificador)) return prev;
        return [nuevaPuja, ...prev];
      });
    });
  }, []);

  // ── Re-fetch de subasta (polling para detectar cambio de item) ─────────────

  const refetchSubasta = useCallback(async () => {
    try {
      const sub = await subastaService.obtener(Number(id));
      setSubasta(sub);

      if (sub.itemActivoId !== itemActivoIdRef.current) {
        // cambió el item activo: resetear todo
        itemActivoIdRef.current = sub.itemActivoId;
        setCountdown(calcCountdown(sub));

        if (sub.itemActivoId) {
          suscribirItem(sub.itemActivoId);
          const nuevasPujas = await pujaService.historial(sub.itemActivoId);
          setPujasActivas(nuevasPujas.sort((a, b) => b.importe - a.importe));
        } else {
          wsCancelRef.current?.();
          setPujasActivas([]);
        }
      } else if (sub.itemActivoId) {
        // mismo item: re-fetchear pujas como fallback al WebSocket
        const nuevasPujas = await pujaService.historial(sub.itemActivoId);
        setPujasActivas(nuevasPujas.sort((a, b) => b.importe - a.importe));
      }
    } catch {
      // error silencioso en polling
    }
  }, [id, suscribirItem]);

  // ── Carga inicial ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;

    const cargar = async () => {
      setLoading(true);
      try {
        const [sub, usuario] = await Promise.all([
          subastaService.obtener(Number(id)),
          usuarioService.getUsuarioLocal(),
        ]);
        setSubasta(sub);
        setUsuario(usuario);
        setCountdown(calcCountdown(sub));
        itemActivoIdRef.current = sub.itemActivoId;

        const asistentes = await subastaService.listarAsistentes(Number(id));
        const map: Record<number, number> = {};
        asistentes.forEach((a) => { map[a.identificador] = a.numeroPostor; });
        setAsistentesMap(map);
        const miAsistente = asistentes.find((a) => a.usuarioId === usuario?.id) ?? null;
        setAsistente(miAsistente);

        try {
          const catalogo = await catalogoService.obtenerDetallePorSubasta(Number(id));
          setItems(catalogo.items ?? []);
        } catch {
          setItems([]);
        }

        if (sub.itemActivoId) {
          suscribirItem(sub.itemActivoId);
          const pujas = await pujaService.historial(sub.itemActivoId);
          setPujasActivas(pujas.sort((a, b) => b.importe - a.importe));
        }
      } catch {
        // error silencioso
      } finally {
        setLoading(false);
      }
    };

    cargar();

    // polling cada 3s: fallback si WS falla + detectar cambio de item activo
    pollingRef.current = setInterval(refetchSubasta, 3_000);

    return () => {
      wsCancelRef.current?.();
      if (pollingRef.current) clearInterval(pollingRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  // ── Countdown local ────────────────────────────────────────────────────────

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (subasta?.estado !== "abierta" || !subasta.itemActivoId) return;

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refetchSubasta();
          return subasta.tiempoItemSegundos ?? TIMER_INICIAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [subasta?.itemActivoId, subasta?.estado]);

  // ── Unirse a la subasta ────────────────────────────────────────────────────

  const handleUnirse = async () => {
    if (!subasta) return;
    const usuario = await usuarioService.getUsuarioLocal();
    if (!usuario) return;
    setJoining(true);
    setJoinError(null);
    try {
      const asistentes = await subastaService.listarAsistentes(subasta.id);
      const nuevo = await subastaService.registrarAsistente(subasta.id, {
        numeroPostor: asistentes.length + 1,
        usuarioId: usuario.id,
      });
      setAsistente(nuevo);
      setAsistentesMap((prev) => ({ ...prev, [nuevo.identificador]: nuevo.numeroPostor }));
    } catch (e: any) {
      setJoinError(e.message ?? "No se pudo unirse a la subasta.");
    } finally {
      setJoining(false);
    }
  };

  // ── Puja local (optimista: agregar antes de recibir por WS) ───────────────

  const handlePujaLocal = (puja: PujaResponse) => {
    setPujasActivas((prev) => {
      if (prev.some((p) => p.identificador === puja.identificador)) return prev;
      return [puja, ...prev].sort((a, b) => b.importe - a.importe);
    });
  };

  // ── Renders condicionales ──────────────────────────────────────────────────

  if (loading) {
    return (
      <CenterView>
        <ActivityIndicator size="large" color={GOLD} />
      </CenterView>
    );
  }

  if (!subasta) {
    return (
      <CenterView>
        <Text style={s.muted}>No se encontró la subasta.</Text>
      </CenterView>
    );
  }

  const estaAbierta = subasta.estado === "abierta";
  const imagen = CATEGORIA_IMAGE[subasta.categoria];
  const motivo = motivoNoPuede(usuario, subasta);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: BG }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <View style={[s.hero, { height: 200 + insets.top }]}>
          <Image source={{ uri: imagen }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
          <View style={s.heroOverlay} />
          <View style={[s.heroHeader, { paddingTop: insets.top + 12 }]}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
              <MaterialIcons name="arrow-back-ios" size={20} color="#e5e2c6" />
            </TouchableOpacity>
            <View style={[s.estadoBadge, {
              backgroundColor: estaAbierta ? "rgba(76,223,138,0.15)" : "rgba(231,76,60,0.15)",
            }]}>
              <View style={[s.estadoDot, { backgroundColor: estaAbierta ? GREEN : RED }]} />
              <Text style={[s.estadoText, { color: estaAbierta ? GREEN : RED }]}>
                {estaAbierta ? "ABIERTA" : "CERRADA"}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Info de la subasta ───────────────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.titulo}>SUBASTA #{subasta.id}</Text>
          <View style={s.metaRow}>
            <View style={s.metaBadge}>
              <MaterialIcons name="event" size={12} color={GOLD} />
              <Text style={s.metaText}>{subasta.fecha} · {subasta.hora}hs</Text>
            </View>
            <View style={s.metaBadge}>
              <MaterialIcons name="label" size={12} color={GOLD} />
              <Text style={s.metaText}>{subasta.categoria.toUpperCase()}</Text>
            </View>
            {subasta.ubicacion ? (
              <View style={s.metaBadge}>
                <MaterialIcons name="place" size={12} color={GOLD} />
                <Text style={s.metaText}>{subasta.ubicacion}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* ── CERRADA: resultados ──────────────────────────────────────── */}
        {!estaAbierta && (
          <View style={s.section}>
            <ResultadosSection subastaId={subasta.id} onVolver={() => router.back()} />
          </View>
        )}

        {/* ── ABIERTA sin asistente: unirse ────────────────────────────── */}
        {estaAbierta && !asistente && (
          <View style={s.section}>
            <View style={s.card}>
              <Text style={s.cardTitle}>PARTICIPAR EN LA SUBASTA</Text>
              <Text style={s.muted} numberOfLines={2}>
                Uníte como postor para realizar pujas sobre los artículos del catálogo.
              </Text>
              {motivo ? (
                <View style={[s.bloqueoRow, { marginTop: 10, marginBottom: 0 }]}>
                  <MaterialIcons name="lock" size={14} color={GOLD} />
                  <Text style={s.bloqueoText}>{motivo}</Text>
                </View>
              ) : null}
              {joinError ? (
                <View style={[s.errorRow, { marginTop: 10 }]}>
                  <MaterialIcons name="error-outline" size={14} color={RED} />
                  <Text style={s.errorText}>{joinError}</Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={[s.joinBtn, { marginTop: 14 }, joining && { opacity: 0.5 }]}
                onPress={handleUnirse}
                disabled={joining}
              >
                {joining ? (
                  <ActivityIndicator color={BG} size="small" />
                ) : (
                  <>
                    <MaterialIcons name="how-to-reg" size={16} color={BG} />
                    <Text style={s.joinBtnText}>UNIRSE A LA SUBASTA</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── ABIERTA con asistente: flujo de pujas ────────────────────── */}
        {estaAbierta && asistente && (
          <View style={s.section}>
            <Text style={s.postor}>Postor #{asistente.numeroPostor}</Text>

            {/* Sin item activo todavía */}
            {!itemActivo && (
              <View style={[s.card, { alignItems: "center", gap: 10 }]}>
                <ActivityIndicator color={GOLD} />
                <Text style={s.muted}>Esperando inicio del remate...</Text>
              </View>
            )}

            {/* Item activo */}
            {itemActivo && (
              <ItemActivoCard
                item={itemActivo}
                pujas={pujasActivas}
                asistenteId={asistente.identificador}
                categoria={subasta.categoria}
                countdown={countdown}
                onPujaLocal={handlePujaLocal}
                motivoBloqueo={motivo}
              />
            )}

            {/* Chat de pujas */}
            {itemActivo && (
              <>
                <Text style={s.sectionLabel}>HISTORIAL DE PUJAS</Text>
                <ChatPujas pujas={pujasActivas} asistentesMap={asistentesMap} />
              </>
            )}

            {/* Items pendientes */}
            {itemsPendientes.length > 0 && (
              <>
                <Text style={s.sectionLabel}>PRÓXIMOS</Text>
                {itemsPendientes.map((item) => (
                  <View key={item.id} style={s.itemPendienteRow}>
                    <MaterialIcons name="hourglass-empty" size={14} color="#3a5070" />
                    <Text style={s.itemPendienteTitulo} numberOfLines={1}>
                      {item.producto.descripcionCompleta}
                    </Text>
                    <Text style={s.itemPendienteBase}>${fmt(item.precioBase)}</Text>
                  </View>
                ))}
              </>
            )}

            {/* Items vendidos */}
            {itemsVendidos.length > 0 && (
              <>
                <Text style={s.sectionLabel}>VENDIDOS</Text>
                {itemsVendidos.map((item) => (
                  <View key={item.id} style={s.itemVendidoRow}>
                    <MaterialIcons name="check-circle" size={14} color={GREEN} />
                    <Text style={s.itemVendidoTitulo} numberOfLines={1}>
                      {item.producto.descripcionCompleta}
                    </Text>
                  </View>
                ))}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: BG },
  muted:  { color: "#3a5070", fontFamily: "serif", fontSize: 13, lineHeight: 18 },

  // Hero
  hero:        { position: "relative", overflow: "hidden" },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(5,15,30,0.5)" },
  heroHeader:  { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12 },
  backBtn:     { width: 36, height: 36, justifyContent: "center" },
  estadoBadge: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  estadoDot:   { width: 7, height: 7, borderRadius: 4 },
  estadoText:  { fontFamily: "serif", fontSize: 11, fontWeight: "900", letterSpacing: 1 },

  // Info
  section:   { paddingHorizontal: 16, paddingTop: 16 },
  titulo:    { color: "#e5e2c6", fontFamily: "serif", fontSize: 22, fontWeight: "900", letterSpacing: 1, marginBottom: 10 },
  metaRow:   { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 4 },
  metaBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(212,175,55,0.08)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(212,175,55,0.2)" },
  metaText:  { color: GOLD, fontFamily: "serif", fontSize: 11, fontWeight: "700" },
  postor:    { color: GOLD, fontFamily: "serif", fontSize: 12, fontWeight: "900", letterSpacing: 2, marginBottom: 12 },

  // Card genérica
  card:       { backgroundColor: CARD, borderRadius: 16, borderWidth: 1, borderColor: "#0f2540", padding: 16 },
  cardTitle:  { color: "#e5e2c6", fontFamily: "serif", fontSize: 13, fontWeight: "900", letterSpacing: 2, marginBottom: 6 },

  // Item activo
  itemActivoCard:   { backgroundColor: CARD, borderRadius: 16, borderWidth: 1, borderColor: "rgba(76,223,138,0.25)", padding: 16 },
  itemActivoHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  liveBadge:        { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot:          { width: 8, height: 8, borderRadius: 4, backgroundColor: "#4cdf8a" },
  liveBadgeText:    { color: "#4cdf8a", fontFamily: "serif", fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  countdownBadge:   { flexDirection: "row", alignItems: "center", gap: 4 },
  countdownText:    { color: GOLD, fontFamily: "serif", fontSize: 14, fontWeight: "900" },
  itemActivoTitulo: { color: "#e5e2c6", fontFamily: "serif", fontSize: 16, fontWeight: "900", lineHeight: 22, marginBottom: 2 },
  itemActivoArtista:{ color: "#3a5070", fontFamily: "serif", fontSize: 12, marginBottom: 12 },
  preciosRow:       { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  precioLabel:      { color: "#3a5070", fontFamily: "serif", fontSize: 10, letterSpacing: 1.5, marginBottom: 2 },
  precioValor:      { color: GOLD, fontFamily: "serif", fontSize: 16, fontWeight: "900" },
  rangoText:        { color: "#3a5070", fontFamily: "serif", fontSize: 11, marginBottom: 12 },

  // Input puja
  pujaRow:    { flexDirection: "row", gap: 8 },
  pujaInput:  { flex: 1, backgroundColor: "#050f1e", borderRadius: 10, borderWidth: 1, borderColor: "#0f2540", color: "#e5e2c6", fontFamily: "serif", fontSize: 14, paddingHorizontal: 12, height: 44 },
  pujaBtn:    { backgroundColor: GOLD, borderRadius: 10, height: 44, flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16 },
  pujaBtnText:{ color: BG, fontFamily: "serif", fontSize: 13, fontWeight: "900" },
  errorRow:   { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  errorText:  { color: "#e74c3c", fontFamily: "serif", fontSize: 12, flex: 1 },
  bloqueoRow: {
    flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10,
    padding: 10, borderRadius: 8,
    backgroundColor: "rgba(212,175,55,0.10)",
    borderWidth: 1, borderColor: "rgba(212,175,55,0.35)",
  },
  bloqueoText: { color: "#d4af37", fontFamily: "serif", fontSize: 12, flex: 1 },

  // Chat
  sectionLabel:   { color: "#3a5070", fontFamily: "serif", fontSize: 11, fontWeight: "900", letterSpacing: 2, marginTop: 20, marginBottom: 8 },
  chatContainer:  { backgroundColor: CARD, borderRadius: 14, borderWidth: 1, borderColor: "#0f2540", overflow: "hidden" },
  chatEmpty:      { backgroundColor: CARD, borderRadius: 14, borderWidth: 1, borderColor: "#0f2540", padding: 16, alignItems: "center" },
  chatRow:        { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#0d2035" },
  chatRowMejor:   { backgroundColor: "rgba(76,223,138,0.06)" },
  chatPostor:     { color: "#8aa3be", fontFamily: "serif", fontSize: 13 },
  chatImporte:    { color: "#e5e2c6", fontFamily: "serif", fontSize: 14, fontWeight: "900" },

  // Pendientes / vendidos
  itemPendienteRow:    { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#0d2035" },
  itemPendienteTitulo: { color: "#8aa3be", fontFamily: "serif", fontSize: 13, flex: 1 },
  itemPendienteBase:   { color: "#3a5070", fontFamily: "serif", fontSize: 12 },
  itemVendidoRow:      { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#0d2035" },
  itemVendidoTitulo:   { color: "#3a5070", fontFamily: "serif", fontSize: 13, flex: 1, textDecorationLine: "line-through" },

  // Join
  joinBtn:    { backgroundColor: GOLD, borderRadius: 12, height: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  joinBtnText:{ color: BG, fontFamily: "serif", fontSize: 14, fontWeight: "900", letterSpacing: 1 },

  // Resultados
  resultRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: "#0d2035" },
  resultDesc:   { color: "#8aa3be", fontFamily: "serif", fontSize: 13, flex: 1, marginRight: 8 },
  resultImporte:{ fontFamily: "serif", fontSize: 14, fontWeight: "900" },
});
